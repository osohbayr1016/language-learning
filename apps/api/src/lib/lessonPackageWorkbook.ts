import type { ImportedWorkbookItem, ImportedWorkbookSection } from './lessonImportTypes';

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function isNoAutoGrade(ans: unknown): boolean {
  if (ans === undefined || ans === null) return false;
  if (typeof ans === 'boolean') return false;
  const s = String(ans).trim();
  return s === '' || s === '__NO_AUTO_GRADE__';
}

function canonicalAnswer(ex: Record<string, unknown>): string | boolean | null {
  const ca = ex.correct_answer;
  const a = ex.answer;
  const pickFirst = (): unknown => {
    if (!isNoAutoGrade(ca)) return ca;
    if (!isNoAutoGrade(a)) return a;
    return null;
  };
  const raw = pickFirst();
  if (raw === null || raw === undefined || isNoAutoGrade(raw)) return null;
  if (typeof raw === 'boolean') return raw;
  return String(raw).trim();
}

function sectionTitleForSkill(skill: string): string {
  if (skill === 'listening') return 'Сонсох';
  if (skill === 'reading') return 'Унших';
  if (skill === 'writing') return 'Бичих';
  return skill || 'Workbook';
}

export function workbookFromPackageExercises(rows: unknown): { sections: ImportedWorkbookSection[] } {
  if (!Array.isArray(rows) || !rows.length) return { sections: [] };
  const bySkill = new Map<string, ImportedWorkbookItem[]>();
  for (const raw of rows) {
    const ex = (raw ?? {}) as Record<string, unknown>;
    const skill = str(ex.skill) || 'workbook';
    const type = str(ex.type);
    const q = str(ex.question);
    if (!q) continue;
    const item: ImportedWorkbookItem = { q };
    if (Array.isArray(ex.choices) && ex.choices.length) {
      item.options = ex.choices.map((x) => String(x).trim()).filter(Boolean);
    }
    const resolved = canonicalAnswer(ex);
    item.answer = resolved;
    const jsonGradable = ex.is_gradable === true;
    item.gradable = jsonGradable && resolved !== null;
    if (type) item.packageExerciseType = type;

    const au = str(ex.audio);
    const ft = str(ex.full_track);
    if (au) item.audio_url = au;
    if (ft) item.full_track_url = ft;
    if (!item.options?.length && type === 'true_false') {
      item.options = ['Зөв', 'Буруу'];
    }
    if (!bySkill.has(skill)) bySkill.set(skill, []);
    bySkill.get(skill)!.push(item);
  }
  const sections: ImportedWorkbookSection[] = [];
  for (const [sk, items] of bySkill) {
    sections.push({
      type: sk,
      title: sectionTitleForSkill(sk),
      items,
    });
  }
  return { sections };
}
