import type { ExamDraftQuestion } from '../examImport/examDraftTypes';

type Props = {
  drafts: ExamDraftQuestion[];
  onPatch: (index: number, patch: Partial<ExamDraftQuestion>) => void;
};

export function ExamImportTable({ drafts, onPatch }: Props) {
  return (
    <div style={{ maxHeight: '480px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
      <table className="data-table" style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Сэдэв</th>
            <th>Асуултын текст</th>
            <th>Зөв</th>
            <th>Аудио key</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((q, i) => (
            <tr key={q.order_num}>
              <td>{q.order_num}</td>
              <td>
                {q.section === 'listening' ? 'Цөм' : 'Унших'} · {q.question_num}
              </td>
              <td style={{ maxWidth: 360 }}>
                <textarea
                  className="form-control"
                  style={{ width: '100%', minHeight: 44, resize: 'vertical' }}
                  value={q.section === 'listening' ? q.audio_text : q.question_text}
                  onChange={(e) =>
                    onPatch(i, q.section === 'listening' ? { audio_text: e.target.value } : { question_text: e.target.value })
                  }
                />
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <select
                  className="form-control"
                  value={q.options.includes(q.correct_answer) ? q.correct_answer : ''}
                  onChange={(ev) => onPatch(i, { correct_answer: ev.target.value })}
                >
                  {q.options.map((o, oi) => (
                    <option key={`${q.order_num}-${oi}`} value={o}>
                      {o.length > 48 ? `${o.slice(0, 45)}…` : o}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ fontSize: 11, maxWidth: 140, wordBreak: 'break-all' }}>{q.audio_key ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
