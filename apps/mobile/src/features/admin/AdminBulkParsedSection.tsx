import React from 'react';
import { AdminBulkHanziPreview } from './AdminBulkHanziPreview';
import { AdminHanziExampleFieldsBlock } from './AdminHanziExampleFieldsBlock';
import type { AdminBulkValidateRow } from '../../lib/api/admin';
import type { ParsedImportLine } from './parseHanziImportLines';

type Props = {
  preview: ParsedImportLine[];
  okRows: Extract<ParsedImportLine, { ok: true }>[];
  errRows: Extract<ParsedImportLine, { ok: false }>[];
  serverFails: Extract<AdminBulkValidateRow, { ok: false }>[];
  token: boolean;
  bulkExZh: string;
  bulkExPy: string;
  bulkExMn: string;
  onBulkExZh: (v: string) => void;
  onBulkExPy: (v: string) => void;
  onBulkExMn: (v: string) => void;
};

export function AdminBulkParsedSection({
  preview,
  okRows,
  errRows,
  serverFails,
  token,
  bulkExZh,
  bulkExPy,
  bulkExMn,
  onBulkExZh,
  onBulkExPy,
  onBulkExMn,
}: Props) {
  if (!preview.length) return null;
  return (
    <>
      <AdminBulkHanziPreview
        preview={preview}
        okRows={okRows}
        errRows={errRows}
        serverFails={serverFails}
        sharedExample={{ zh: bulkExZh, py: bulkExPy, mn: bulkExMn }}
      />
      <AdminHanziExampleFieldsBlock
        exampleZh={bulkExZh}
        examplePinyin={bulkExPy}
        exampleMn={bulkExMn}
        onExampleZh={onBulkExZh}
        onExamplePinyin={onBulkExPy}
        onExampleMn={onBulkExMn}
        showBulkHint
        disabled={!token}
      />
    </>
  );
}
