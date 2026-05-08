import { Hono } from 'hono';
import { fetchHanziWriterMeta } from '../../lib/hanziWriterCdn';
import type { Env, Variables } from '../../types';

const usersWords = new Hono<{ Bindings: Env; Variables: Variables }>();

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

usersWords.post('/words', async (c) => {
  const body = await c.req.json<{
    hanzi: string;
    pinyin: string;
    meaning_mn: string;
    meaning_en?: string;
    hsk_level?: number;
    part_of_speech?: string;
    example_zh?: string;
    example_pinyin?: string;
    example_mn?: string;
  }>();

  const hz = typeof body.hanzi === 'string' ? body.hanzi.trim() : '';
  if (!hz) return c.json({ error: 'Ханз оруулна уу' }, 400);
  const chars = [...hz];
  if (chars.length !== 1) {
    return c.json({ error: 'Одоогоор нэг ханз (нэг код цэг) л зөвшөөрнө' }, 400);
  }

  const meta = await fetchHanziWriterMeta(chars[0]);
  if (!meta) {
    return c.json(
      {
        error:
          'Энэ тэмдэгтийн HanziWriter stroke өгөгдөл олдсонгүй. Өөр ханз сонго эсвэл өгөгдөлд бүртгэгдсэн тэмдэгт оруулна уу.',
      },
      400
    );
  }

  const pinyin = typeof body.pinyin === 'string' ? body.pinyin.trim() : '';
  const meaning_mn = typeof body.meaning_mn === 'string' ? body.meaning_mn.trim() : '';
  if (!pinyin || !meaning_mn) return c.json({ error: 'Pinyin болон монгол утга заавал' }, 400);

  const hsk = Math.min(6, Math.max(1, Number(body.hsk_level ?? 1)));
  const meaning_en = typeof body.meaning_en === 'string' ? body.meaning_en.trim() : '';
  const pos = typeof body.part_of_speech === 'string' ? body.part_of_speech.trim() || 'noun' : 'noun';
  const exZh = typeof body.example_zh === 'string' ? body.example_zh.trim() : '';
  const exPy = typeof body.example_pinyin === 'string' ? body.example_pinyin.trim() : '';
  const exMn = typeof body.example_mn === 'string' ? body.example_mn.trim() : '';

  const row = await c.env.DB.prepare(
    `INSERT INTO words (
      hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level,
      part_of_speech, example_zh, example_pinyin, example_mn, stroke_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  )
    .bind(
      chars[0],
      pinyin,
      pinyin,
      '[]',
      meaning_mn,
      meaning_en,
      hsk,
      pos,
      exZh,
      exPy,
      exMn,
      meta.strokeCount
    )
    .first<{ id: number }>();

  return c.json({ data: { id: row?.id }, message: 'Үг нэмэгдлээ' }, 201);
});

export default usersWords;
