import { Hono } from 'hono';
import { insertAdminWord, type AdminWordCreateInput } from '../../lib/adminCreateWord';
import { dryRunValidateAdminWord, fetchExistingKanjiMnPairs } from '../../lib/adminWordDryRun';
import type { Env, Variables } from '../../types';
import { jsonBodyInvalid, readJsonBody } from '../../lib/requestJson';

const usersWords = new Hono<{ Bindings: Env; Variables: Variables }>();

const BULK_WORDS_MAX = 80;

usersWords.get('/users', async (c) => {
  const limit = Math.min(Math.max(Math.trunc(Number(c.req.query('limit') ?? 50)), 1), 200);
  const offset = Math.max(Math.trunc(Number(c.req.query('offset') ?? 0)), 0);
  const q = await c.env.DB.prepare(
    `SELECT id, email, display_name, is_admin, created_at
     FROM users ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`
  ).all();
  const list = Array.isArray(q?.results) ? q.results : [];
  return c.json({ data: list });
});

type BulkOut =
  | { ok: true; id: number; kanji: string }
  | { ok: true; skipped: true; kanji: string }
  | { ok: false; kanji: string; error: string };

usersWords.post('/words/bulk/validate', async (c) => {
  const payload = await readJsonBody<{
    words?: AdminWordCreateInput[];
    jlpt_level?: number;
    textbook_unit?: string | null;
  }>(c);
  if (!payload) return jsonBodyInvalid(c);
  const rows = Array.isArray(payload.words) ? payload.words : [];
  const defaultJlpt = Math.min(5, Math.max(1, Number(payload.jlpt_level ?? 1)));
  const globalTb =
    typeof payload.textbook_unit === 'string' ? payload.textbook_unit.trim() : '';
  if (rows.length === 0) return c.json({ error: 'Ядаж нэг үг оруулна уу' }, 400);
  if (rows.length > BULK_WORDS_MAX) {
    return c.json({ error: `Нэг удаадад хамгийн ихдээ ${BULK_WORDS_MAX} үг` }, 400);
  }

  const results: (
    | { ok: true; kanji: string; strokeCount: number }
    | { ok: false; kanji: string; error: string }
  )[] = [];

  for (const raw of rows) {
    const merged: AdminWordCreateInput = {
      ...raw,
      jlpt_level: raw.jlpt_level != null ? raw.jlpt_level : defaultJlpt,
      textbook_unit: (raw.textbook_unit ?? globalTb) || undefined,
    };
    const kjRaw = typeof merged.kanji === 'string' ? merged.kanji.trim() : '';
    const r = await dryRunValidateAdminWord(merged);
    if (r.ok) {
      results.push({ ok: true, kanji: r.kanji, strokeCount: r.strokeCount });
    } else {
      results.push({ ok: false, kanji: kjRaw || '—', error: r.error });
    }
  }

  return c.json({ data: { results } }, 200);
});

usersWords.post('/words/bulk', async (c) => {
  const payload = await readJsonBody<{
    words?: AdminWordCreateInput[];
    jlpt_level?: number;
    duplicate_policy?: 'fail' | 'skip';
    textbook_unit?: string | null;
  }>(c);
  if (!payload) return jsonBodyInvalid(c);
  const rows = Array.isArray(payload.words) ? payload.words : [];
  const defaultJlpt = Math.min(5, Math.max(1, Number(payload.jlpt_level ?? 1)));
  const dupPolicy = payload.duplicate_policy === 'fail' ? 'fail' : 'skip';
  const globalTb =
    typeof payload.textbook_unit === 'string' ? payload.textbook_unit.trim() : '';
  if (rows.length === 0) return c.json({ error: 'Ядаж нэг үг оруулна уу' }, 400);
  if (rows.length > BULK_WORDS_MAX) {
    return c.json({ error: `Нэг удаадад хамгийн ихдээ ${BULK_WORDS_MAX} үг` }, 400);
  }

  const mergedRows = rows.map((raw) => ({
    ...raw,
    jlpt_level: raw.jlpt_level != null ? raw.jlpt_level : defaultJlpt,
    textbook_unit: (raw.textbook_unit ?? globalTb) || undefined,
  }));

  const pairCandidates: { kanji: string; meaning_mn: string }[] = [];
  for (const m of mergedRows) {
    const kj = typeof m.kanji === 'string' ? m.kanji.trim() : '';
    const mn = typeof m.meaning_mn === 'string' ? m.meaning_mn.trim() : '';
    if (kj && mn) pairCandidates.push({ kanji: kj, meaning_mn: mn });
  }

  const existingDupKeys = await fetchExistingKanjiMnPairs(c.env.DB, pairCandidates);

  const results: BulkOut[] = [];

  for (const raw of mergedRows) {
    const kjRaw = typeof raw.kanji === 'string' ? raw.kanji.trim() : '';
    const r = await insertAdminWord(c.env.DB, raw, {
      duplicatePolicy: dupPolicy === 'fail' ? 'fail' : 'skip',
      existingDupKeys,
    });

    if (r.kind === 'inserted') {
      results.push({ ok: true, id: r.id, kanji: r.kanji });
    } else if (r.kind === 'skipped_dup') {
      results.push({ ok: true, skipped: true, kanji: r.kanji });
    } else {
      results.push({ ok: false, kanji: kjRaw || '—', error: r.message });
    }
  }

  return c.json({ data: { results } }, 201);
});

usersWords.post('/words', async (c) => {
  const body = await readJsonBody<AdminWordCreateInput & { reject_duplicate?: boolean }>(c);
  if (!body) return jsonBodyInvalid(c);
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
