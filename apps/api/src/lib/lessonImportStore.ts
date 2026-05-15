import type { ImportedLessonContent } from './lessonImportTypes';
import type { ImportedWordLink } from './lessonImportWords';

type StoreInput = {
  chapterId: number;
  isPublished: boolean;
  content: ImportedLessonContent;
  links: ImportedWordLink[];
};

async function ensureChapter(db: D1Database, chapterId: number) {
  const row = await db.prepare('SELECT id FROM chapters WHERE id = ?').bind(chapterId).first<{ id: number }>();
  if (!row?.id) throw new Error('Сонгосон бүлэг олдсонгүй');
}

async function nextLessonOrder(db: D1Database, chapterId: number): Promise<number> {
  const row = await db
    .prepare('SELECT COALESCE(MAX(order_num), 0) AS max_order FROM lessons WHERE chapter_id = ?')
    .bind(chapterId)
    .first<{ max_order: number }>();
  return Number(row?.max_order ?? 0) + 1;
}

function titleForLesson(content: ImportedLessonContent): string {
  if (content.title_mn && content.title_jp) return `${content.title_jp} · ${content.title_mn}`;
  return content.title_mn || content.title_jp;
}

function workbookCount(content: ImportedLessonContent): number {
  return content.workbook.sections.reduce((n, s) => n + s.items.length, 0);
}

export async function storeImportedLesson(db: D1Database, input: StoreInput): Promise<number> {
  await ensureChapter(db, input.chapterId);
  const existing = await db
    .prepare('SELECT lesson_id FROM lesson_contents WHERE external_lesson_id = ?')
    .bind(input.content.external_lesson_id)
    .first<{ lesson_id: number }>();

  const title = titleForLesson(input.content);
  const pub = input.isPublished ? 1 : 0;
  let lessonId = Number(existing?.lesson_id ?? 0);

  if (lessonId) {
    await db
      .prepare(
        `UPDATE lessons SET chapter_id = ?, title_mn = ?, subtitle_mn = ?, icon = 'book',
         is_published = ? WHERE id = ?`
      )
      .bind(input.chapterId, title, input.content.source, pub, lessonId)
      .run();
  } else {
    const row = await db
      .prepare(
        `INSERT INTO lessons (chapter_id, title_mn, subtitle_mn, icon, order_num, is_published)
         VALUES (?, ?, ?, 'book', ?, ?) RETURNING id`
      )
      .bind(input.chapterId, title, input.content.source, await nextLessonOrder(db, input.chapterId), pub)
      .first<{ id: number }>();
    lessonId = Number(row?.id ?? 0);
  }
  if (!lessonId) throw new Error('Хичээл хадгалагдсангүй');

  await db.prepare('DELETE FROM lesson_words WHERE lesson_id = ?').bind(lessonId).run();
  if (input.links.length) {
    await db.batch(
      input.links.map((l) =>
        db.prepare('INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES (?, ?, ?)')
          .bind(lessonId, l.wordId, l.orderNum)
      )
    );
  }

  const contentJson = JSON.stringify(input.content);
  await db
    .prepare(
      `INSERT INTO lesson_contents
       (lesson_id, external_lesson_id, source, title_jp, title_mn, summary, content_json,
        dialogue_count, grammar_count, workbook_count, quizlet_text, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(external_lesson_id) DO UPDATE SET
         lesson_id = excluded.lesson_id, source = excluded.source, title_jp = excluded.title_jp,
         title_mn = excluded.title_mn, summary = excluded.summary, content_json = excluded.content_json,
         dialogue_count = excluded.dialogue_count, grammar_count = excluded.grammar_count,
         workbook_count = excluded.workbook_count, quizlet_text = excluded.quizlet_text,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(
      lessonId,
      input.content.external_lesson_id,
      input.content.source,
      input.content.title_jp,
      input.content.title_mn,
      input.content.summary,
      contentJson,
      input.content.dialogues.length,
      input.content.grammar.length,
      workbookCount(input.content),
      input.content.quizlet_text
    )
    .run();

  return lessonId;
}
