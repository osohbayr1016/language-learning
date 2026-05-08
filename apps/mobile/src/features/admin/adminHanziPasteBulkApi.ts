import { api } from '../../lib/api';
import type { AdminBulkValidateRow } from '../../lib/api/admin';
import type { ParsedImportLine } from './parseHanziImportLines';
import { examplePatchFromTriplet } from './exampleFieldsForAdminWord';

type OkRow = Extract<ParsedImportLine, { ok: true }>;

type ExTriplet = { exampleZh: string; examplePinyin: string; exampleMn: string };

function mapWords(rows: OkRow[], ex?: ExTriplet) {
  const patch = examplePatchFromTriplet(
    ex ?? { exampleZh: '', examplePinyin: '', exampleMn: '' }
  );
  const hasPatch = Object.keys(patch).length > 0;
  return rows.map((r) => ({
    hanzi: r.hanzi,
    pinyin: r.pinyin,
    meaning_mn: r.meaning_mn,
    ...(hasPatch ? patch : {}),
  }));
}

export async function execAdminBulkValidate(opts: {
  token: string;
  okRows: OkRow[];
  hsk: number;
  textbookTrim: string;
  examples?: ExTriplet;
}): Promise<{ results: AdminBulkValidateRow[]; fails: Extract<AdminBulkValidateRow, { ok: false }>[] }> {
  const res = await api.admin.validateWordsBulk(opts.token, {
    words: mapWords(opts.okRows, opts.examples),
    hsk_level: opts.hsk,
    textbook_unit: opts.textbookTrim || undefined,
  });
  const results = res.data.results;
  const fails = results.filter((r): r is Extract<AdminBulkValidateRow, { ok: false }> => !r.ok);
  return { results, fails };
}

export async function execAdminBulkCreate(opts: {
  token: string;
  okRows: OkRow[];
  hsk: number;
  textbookTrim: string;
  dupPolicy: 'fail' | 'skip';
  examples?: ExTriplet;
}) {
  return api.admin.createWordsBulk(opts.token, {
    words: mapWords(opts.okRows, opts.examples),
    hsk_level: opts.hsk,
    textbook_unit: opts.textbookTrim || undefined,
    duplicate_policy: opts.dupPolicy,
  });
}
