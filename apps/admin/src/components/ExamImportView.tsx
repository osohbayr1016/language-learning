import { ExamImportTable } from './ExamImportTable';
import { ExamImportStepCard } from './ExamImportStepCard';
import { useExamImportWizard } from '../examImport/useExamImportWizard';

function fileLine(f: File | null) {
  if (!f?.name) return '— Сонгоогүй';
  return `${f.name} (${Math.round(f.size / 1024)} KB)`;
}

export function ExamImportView({ token }: { token: string }) {
  const w = useExamImportWizard(token);

  return (
    <div style={{ maxWidth: 1100 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>HSK шалгалт — PDF + хариулт + WAV/MP3 импорт</h1>
        <p className="text-muted" style={{ margin: 0, lineHeight: 1.55 }}>
          <strong>4 алхам.</strong> 2-д PDF задалвал асуулт үүлнэ; 3-т WAV эсвэл MP3 файлыг сонсоход асуулт бүрт дарааллаар (1-т = асуулт 1 …). PDF дархад аль хэдийн сонгосон дуу автоматаар холбогдоно. Дахин өөрчлөхөд{' '}
          <em>дахин суулгах</em> товчыг дарна уу.
        </p>
      </header>

      {w.err ? (
        <div style={{ color: 'var(--error)', marginBottom: 16, padding: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
          {w.err}
        </div>
      ) : null}

      <ExamImportStepCard step={1} title="Тестийн нэр, түвшин, хугацаа">
        <div className="form-group">
          <label>Гарчиг</label>
          <input className="form-control" value={w.title} onChange={(e) => w.setTitle(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="form-group">
            <label>HSK (1–6)</label>
            <input type="number" className="form-control" min={1} max={6} value={w.hsk} onChange={(e) => w.setHsk(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Хугацаа (мин)</label>
            <input type="number" className="form-control" min={1} value={w.dur} onChange={(e) => w.setDur(Number(e.target.value))} />
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={w.publish} onChange={(e) => w.setPublish(e.target.checked)} />
          Апп дээр харагдах (нийтэх)
        </label>
        <small style={{ display: 'block', marginTop: 6, opacity: 0.85, maxWidth: 560 }}>
          Унтраахад загвар серверт үлдэнэ, харин «Дүрмийн шалгалт» сонгон дээр зөвхөн нийтлэгдсэн тестүүд харагдана.
        </small>
      </ExamImportStepCard>

      <ExamImportStepCard step={2} title="Шалгалтын PDF + хариултын PDF">
        <div className="form-group">
          <label>Exam paper (.pdf)</label>
          <input type="file" accept="application/pdf,.pdf" disabled={w.busy} onChange={(e) => w.setExamFile(e.target.files?.[0] ?? null)} />
          <small style={{ display: 'block', marginTop: 6, opacity: 0.85 }}>{fileLine(w.examFile)}</small>
        </div>
        <div className="form-group">
          <label>Answer sheet (.pdf)</label>
          <input type="file" accept="application/pdf,.pdf" disabled={w.busy} onChange={(e) => w.setAnsFile(e.target.files?.[0] ?? null)} />
          <small style={{ display: 'block', marginTop: 6, opacity: 0.85 }}>{fileLine(w.ansFile)}</small>
        </div>
        <button type="button" className="btn btn-primary" disabled={w.busy || !w.examFile || !w.ansFile} onClick={() => void w.runParse()}>
          {w.busy ? 'Задлаж байна…' : 'PDF-аас задалж асуулт үүсгэх'}
        </button>
        {w.drafts ? (
          <p style={{ marginTop: 12, marginBottom: 0, color: 'var(--success, #16a34a)', fontWeight: 600 }}>
            Үүссэн: {w.drafts.length} асуулт · Сонсох: {w.drafts.filter((d) => d.section === 'listening').length}
          </p>
        ) : null}
      </ExamImportStepCard>

      <ExamImportStepCard step={3} title="Сонсоход WAV/MP3 (олон файл · дараалал чухал)">
        <p style={{ marginTop: 0, fontSize: 14 }}>
          Эхний дууны файл (WAV/MP3) = анхны сонсохийн асуулт · Нийт сонсох:{' '}
          <strong>{w.listenCount || '—'}</strong>
        </p>
        <div className="form-group">
          <input
            key={w.wavInputKey}
            type="file"
            accept="audio/wav,audio/wave,audio/x-wav,audio/mpeg,audio/mp3,.mp3,.wav,audio/*"
            multiple
            disabled={w.busy}
            onChange={(e) => w.setStagedWavs(e.target.files ? Array.from(e.target.files) : [])}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <button type="button" className="btn-secondary" disabled={w.busy || !w.stagedWavs.length} onClick={() => w.clearWavStaging()}>
            Дуу сонголт цэвэрлэх
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={w.busy || !w.drafts?.length || !w.stagedWavs.length}
            onClick={() => void w.applyWavsToCurrentDrafts()}
          >
            Одоогийн асуултад дуу дахин суулгах
          </button>
        </div>
        <small style={{ display: 'block', marginTop: 10 }}>
          {w.stagedWavs.length ? `${w.stagedWavs.length} файл сонгогдсон` : 'Дуу сонгоогүй'}
        </small>
      </ExamImportStepCard>

      <ExamImportStepCard step={4} title="Засвар + серверт хадгалах">
        {!w.drafts ? (
          <p style={{ margin: 0, opacity: 0.8 }}>Эхлээд алхам 2-д PDF задална уу.</p>
        ) : (
          <>
            <ExamImportTable drafts={w.drafts} onPatch={w.onPatch} />
            <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} disabled={w.busy} onClick={() => void w.doImport()}>
              Сервер лүү хадгалах (асуулт + дуу түлхүүр)
            </button>
          </>
        )}
      </ExamImportStepCard>
    </div>
  );
}
