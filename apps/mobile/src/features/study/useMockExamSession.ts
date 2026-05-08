import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../lib/api';
import type { ExamQuestion, ExamTemplate } from '../../lib/api/exams';

type Result = { total: number; passed: boolean; line: number } | null;

export function useMockExamSession(token: string | null | undefined) {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [sid, setSid] = useState<number | null>(null);
  const [qs, setQs] = useState<ExamQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Result>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [starting, setStarting] = useState(false);
  const [startFailed, setStartFailed] = useState(false);
  const autoStartOnce = useRef(false);
  const t0 = useRef(Date.now());

  const selectable = useMemo(() => {
    const hsk1 = templates.filter((x) => x.hsk_level === 1);
    const base = (hsk1.length ? hsk1 : templates).slice();
    base.sort((a, b) => a.id - b.id);
    return base;
  }, [templates]);

  useEffect(() => {
    autoStartOnce.current = false;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!token) {
        setLoadingList(false);
        return;
      }
      try {
        const t = await api.exams.templates(token);
        if (!cancelled) setTemplates(t.data ?? []);
      } catch {
        if (!cancelled) setTemplates([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const begin = useCallback(
    async (templateId: number) => {
      if (!token) return;
      setStarting(true);
      setStartFailed(false);
      try {
        const s = await api.exams.start(token, templateId);
        setSid(s.data.session_id);
        setQs(s.data.questions ?? []);
        setIdx(0);
        setAns({});
        setResult(null);
        t0.current = Date.now();
      } catch {
        setStartFailed(true);
        setQs([]);
      } finally {
        setStarting(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (loadingList || !token || sid !== null || starting || startFailed) return;
    if (selectable.length !== 1) return;
    if (autoStartOnce.current) return;
    autoStartOnce.current = true;
    void begin(selectable[0]!.id);
  }, [loadingList, token, sid, starting, startFailed, selectable, begin]);

  const pick = (v: string) => {
    const cur = qs[idx];
    if (!cur) return;
    setAns((a) => ({ ...a, [cur.id]: v }));
  };

  const submitAll = async () => {
    if (!token || sid === null) return;
    const body = {
      answers: qs.map((q) => ({ question_id: q.id, answer: ans[q.id] ?? '' })),
      duration_seconds: Math.round((Date.now() - t0.current) / 1000),
    };
    const r = await api.exams.submit(token, sid, body);
    setResult({ total: r.data.total_score, passed: r.data.passed, line: r.data.passing_score });
  };

  return {
    templates,
    sid,
    qs,
    idx,
    setIdx,
    ans,
    result,
    loadingList,
    starting,
    startFailed,
    selectable,
    begin,
    pick,
    submitAll,
  };
}
