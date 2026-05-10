import type { ReactNode } from 'react';

type Props = {
  step: number;
  title: string;
  children: ReactNode;
};

/** Numbered bordered block for PDF / WAV wizard */
export function ExamImportStepCard({ step, title, children }: Props) {
  return (
    <section
      className="exam-import-step"
      style={{
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 20,
        background: 'var(--panel, #fafafa)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span
          style={{
            flexShrink: 0,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--primary, #6366f1)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {step}
        </span>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </section>
  );
}
