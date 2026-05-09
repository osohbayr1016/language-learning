import { fetchDueWordsQueue } from './dueWordsQueue';

const DEFAULT_LIMIT = 20;

/** Study queue size for dashboard — matches GET /api/words/due length (capped). */
export async function studyQueueCount(db: D1Database, userId: number, limit = DEFAULT_LIMIT): Promise<number> {
  const rows = await fetchDueWordsQueue(db, userId, limit, { writerOnly: false });
  return rows.length;
}
