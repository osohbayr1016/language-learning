import { useCallback, useState } from 'react';
import type { ExamDraftQuestion } from './examDraftTypes';
import { buildManchesterHsk2Draft } from './buildManchesterHsk2Draft';
import { extractPdfText } from './extractPdfText';
import { uploadListeningWavsToDrafts } from './uploadListeningWavs';
import { adminApi } from '../adminApi';

export function useExamImportWizard(token: string) {
  const [title, setTitle] = useState('HSK 2 Manchester H21329');
  const [hsk, setHsk] = useState(2);
  const [dur, setDur] = useState(55);
  const [publish, setPublish] = useState(true);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [ansFile, setAnsFile] = useState<File | null>(null);
  const [stagedWavs, setStagedWavs] = useState<File[]>([]);
  const [wavInputKey, setWavInputKey] = useState(0);
  const [drafts, setDrafts] = useState<ExamDraftQuestion[] | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const listenCount = drafts?.filter((d) => d.section === 'listening').length ?? 0;

  const runParse = async () => {
    if (!examFile || !ansFile) {
      setErr('Алхам 2: Шалгалтын PDF болон хариултын PDF аль хоёрыг сонгоно уу.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      const [examTx, ansTx] = await Promise.all([
        extractPdfText(await examFile.arrayBuffer()),
        extractPdfText(await ansFile.arrayBuffer()),
      ]);
      let next = buildManchesterHsk2Draft(examTx, ansTx);
      if (stagedWavs.length) next = await uploadListeningWavsToDrafts(token, next, stagedWavs);
      setDrafts(next);
    } catch (e) {
      setDrafts(null);
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const applyWavsToCurrentDrafts = async () => {
    if (!drafts?.length || !stagedWavs.length) return;
    setErr('');
    setBusy(true);
    try {
      setDrafts(await uploadListeningWavsToDrafts(token, drafts, stagedWavs));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onPatch = useCallback((index: number, patch: Partial<ExamDraftQuestion>) => {
    setDrafts((prev) => {
      if (!prev) return prev;
      const n = [...prev];
      n[index] = { ...n[index]!, ...patch };
      return n;
    });
  }, []);

  const clearWavStaging = () => {
    setStagedWavs([]);
    setWavInputKey((k) => k + 1);
  };

  const doImport = async () => {
    if (!drafts?.length) return;
    setErr('');
    setBusy(true);
    try {
      await adminApi.importExam(token, {
        title,
        hsk_level: hsk,
        duration_minutes: dur,
        max_score: 200,
        passing_score: 120,
        is_published: publish,
        questions: drafts.map((q) => ({
          section: q.section,
          part_num: q.part_num,
          question_num: q.question_num,
          audio_text: q.audio_text ?? '',
          question_text: q.question_text ?? '',
          question_pinyin: q.question_pinyin ?? '',
          options: q.options,
          correct_answer: q.correct_answer,
          order_num: q.order_num,
          audio_key: q.audio_key ?? null,
        })),
      });
      alert(`Амжилттай: ${drafts.length} асуулт`);
      setDrafts(null);
      setStagedWavs([]);
      setWavInputKey((k) => k + 1);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return {
    title,
    setTitle,
    hsk,
    setHsk,
    dur,
    setDur,
    publish,
    setPublish,
    examFile,
    setExamFile,
    ansFile,
    setAnsFile,
    stagedWavs,
    setStagedWavs,
    wavInputKey,
    drafts,
    err,
    busy,
    listenCount,
    runParse,
    applyWavsToCurrentDrafts,
    onPatch,
    clearWavStaging,
    doImport,
  };
}
