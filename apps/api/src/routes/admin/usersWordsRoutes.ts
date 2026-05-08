import { Hono } from 'hono';
import { insertAdminWord, type AdminWordCreateInput } from '../../lib/adminCreateWord';
import { dryRunValidateAdminWord, fetchExistingHanziMnPairs } from '../../lib/adminWordDryRun';
import type { Env, Variables } from '../../types';

const usersWords = new Hono<{ Bindings: Env; Variables: Variables }>();

const BULK_WORDS_MAX = 80;

usersWords.get('/users', async (c) => {
  const limit = Math.min(Math.max(Math.trunc(Number(c.req.query('limit') ?? 50)), 1), 200);
  const offset = Math.max(Math.trunc(Number(c.req.query('offset') ?? 0)), 0);
  const q = await c.env.DB.prepare(
    `SELECT id, email, display_name, is_admin, premium_until, created_at
     FROM users ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
  ).all();
  const list = Array.isArray(q?.results) ? q.results : [];
  return c.json({ data: list });
});

usersWords.patch('/users/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id)) return c.json({ error: 'Буруу id' }, 400);
  const body = await c.req.json<{ extend_months?: number; premium_until?: string | null }>();
  const exists = await c.env.DB.prepare('SELECT id, premium_until FROM users WHERE id = ?')
    .bind(id)
    .first<{ id: number; premium_until: string | null }>();
  if (!exists) return c.json({ error: 'Хэрэглэгч олдсонгүй' }, 404);

  if (body.premium_until !== undefined) {
    await c.env.DB.prepare('UPDATE users SET premium_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(body.premium_until, id)
      .run();
    return c.json({ message: 'Шинэчлэгдлээ' });
  }

  const months = Math.min(Math.max(Number(body.extend_months ?? 1), 1), 24);
  const now = new Date();
  const cur = exists.premium_until ? new Date(exists.premium_until) : null;
  const base =
    cur && !Number.isNaN(cur.getTime()) && cur.getTime() > now.getTime() ? cur : now;
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  const iso = next.toISOString();
  await c.env.DB.prepare('UPDATE users SET premium_until = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(iso, id)
    .run();
  return c.json({ message: 'Premium сунгагдлаа', data: { premium_until: iso } });
});

type BulkOut =
  | { ok: true; id: number; hanzi: string }
  | { ok: true; skipped: true; hanzi: string }
  | { ok: false; hanzi: string; error: string };

usersWords.post('/words/bulk/validate', async (c) => {
  const payload = await c.req.json<{
    words?: AdminWordCreateInput[];
    hsk_level?: number;
    textbook_unit?: string | null;
  }>();
  const rows = Array.isArray(payload.words) ? payload.words : [];
  const defaultHsk = Math.min(6, Math.max(1, Number(payload.hsk_level ?? 1)));
  const globalTb =
    typeof payload.textbook_unit === 'string' ? payload.textbook_unit.trim() : '';
  if (rows.length === 0) return c.json({ error: 'Ядаж нэг үг оруулна уу' }, 400);
  if (rows.length > BULK_WORDS_MAX) {
    return c.json({ error: `Нэг удаадад хамгийн ихдээ ${BULK_WORDS_MAX} үг` }, 400);
  }

  const results: (
    | { ok: true; hanzi: string; strokeCount: number }
    | { ok: false; hanzi: string; error: string }
  )[] = [];

  for (const raw of rows) {
    const merged: AdminWordCreateInput = {
      ...raw,
      hsk_level: raw.hsk_level != null ? raw.hsk_level : defaultHsk,
      textbook_unit: (raw.textbook_unit ?? globalTb) || undefined,
    };
    const hzRaw = typeof merged.hanzi === 'string' ? merged.hanzi.trim() : '';
    const r = await dryRunValidateAdminWord(merged);
    if (r.ok) {
      results.push({ ok: true, hanzi: r.hanzi, strokeCount: r.strokeCount });
    } else {
      results.push({ ok: false, hanzi: hzRaw || '—', error: r.error });
    }
  }

  return c.json({ data: { results } }, 200);
});

usersWords.post('/words/bulk', async (c) => {
  const payload = await c.req.json<{
    words?: AdminWordCreateInput[];
    hsk_level?: number;
    duplicate_policy?: 'fail' | 'skip';
    textbook_unit?: string | null;
  }>();
  const rows = Array.isArray(payload.words) ? payload.words : [];
  const defaultHsk = Math.min(6, Math.max(1, Number(payload.hsk_level ?? 1)));
  const dupPolicy = payload.duplicate_policy === 'fail' ? 'fail' : 'skip';
  const globalTb =
    typeof payload.textbook_unit === 'string' ? payload.textbook_unit.trim() : '';
  if (rows.length === 0) return c.json({ error: 'Ядаж нэг үг оруулна уу' }, 400);
  if (rows.length > BULK_WORDS_MAX) {
    return c.json({ error: `Нэг удаадад хамгийн ихдээ ${BULK_WORDS_MAX} үг` }, 400);
  }

  const mergedRows = rows.map((raw) => ({
    ...raw,
    hsk_level: raw.hsk_level != null ? raw.hsk_level : defaultHsk,
    textbook_unit: (raw.textbook_unit ?? globalTb) || undefined,
  }));

  const pairCandidates: { hanzi: string; meaning_mn: string }[] = [];
  for (const m of mergedRows) {
    const hz = typeof m.hanzi === 'string' ? m.hanzi.trim() : '';
    const mn = typeof m.meaning_mn === 'string' ? m.meaning_mn.trim() : '';
    if (hz && mn) pairCandidates.push({ hanzi: hz, meaning_mn: mn });
  }

  const existingDupKeys = await fetchExistingHanziMnPairs(c.env.DB, pairCandidates);

  const results: BulkOut[] = [];

  for (const raw of mergedRows) {
    const hzRaw = typeof raw.hanzi === 'string' ? raw.hanzi.trim() : '';
    const r = await insertAdminWord(c.env.DB, raw, {
      duplicatePolicy: dupPolicy === 'fail' ? 'fail' : 'skip',
      existingDupKeys,
    });

    if (r.kind === 'inserted') {
      results.push({ ok: true, id: r.id, hanzi: r.hanzi });
    } else if (r.kind === 'skipped_dup') {
      results.push({ ok: true, skipped: true, hanzi: r.hanzi });
    } else {
      results.push({ ok: false, hanzi: hzRaw || '—', error: r.message });
    }
  }

  return c.json({ data: { results } }, 201);
});

usersWords.post('/words', async (c) => {
  const body = await c.req.json<AdminWordCreateInput & { reject_duplicate?: boolean }>();
  const { reject_duplicate: rejectDup, ...rest } = body;
  const dupPol = rejectDup === true ? 'fail' : 'allow';

  const r = await insertAdminWord(c.env.DB, rest, { duplicatePolicy: dupPol });

  if (r.kind === 'error') {
    const code = dupPol === 'fail' && /давхардал/u.test(r.message) ? 409 : 400;
    return c.json({ error: r.message }, code);
  }
  if (r.kind === 'skipped_dup') {
    return c.json({ error: 'Энэ үг давхардсан' }, 409);
  }

  return c.json({ data: { id: r.id }, message: 'Үг нэмэгдлээ' }, 201);
});

export default usersWords;
