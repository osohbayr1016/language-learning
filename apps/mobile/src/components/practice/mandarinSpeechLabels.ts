import { mn } from '../../i18n/mn';

export function speakFinalLine(finalPercent: number, hideMongolian: boolean): string {
  return hideMongolian
    ? `Score: ${finalPercent}/100`
    : mn.study.speakFinalGrade.replace('{n}', String(finalPercent));
}

export function speakBreakdown(hPct: number, pPct: number, hideMongolian: boolean): string {
  const h = String(hPct);
  const p = String(pPct);
  return hideMongolian
    ? `Hanzi ${h}% · Pinyin ${p}%`
    : mn.study.speakAggregate.replace('{h}', h).replace('{p}', p);
}

export function speakPermissionDeniedLines(hideMongolian: boolean): {
  breakdown: string;
  finalLine: string;
} {
  return hideMongolian
    ? { breakdown: 'Microphone permission denied', finalLine: 'Score: 0/100' }
    : { breakdown: 'Зөвшөөрөл аваагүй', finalLine: mn.study.speakFinalGrade.replace('{n}', '0') };
}

export function speakExampleAside(exampleZh: string, hideMongolian: boolean): string {
  return hideMongolian ? `Example: ${exampleZh}` : mn.study.speakExampleHint.replace('{s}', exampleZh);
}

export function speakMicListeningHintEn(): string {
  return 'Tap again to stop; recording stops automatically after a few seconds. Audio is not stored.';
}

export function speakOutcomeBlock(opts: {
  hideMongolian: boolean;
  submitted: boolean;
  points: number | null;
  transcript: string | null;
  finalLine: string | null;
  breakdown: string | null;
  passedRound: boolean | null;
}): string {
  const { hideMongolian, submitted, points, transcript, finalLine, breakdown, passedRound } = opts;
  if (!(submitted && points !== null)) {
    return hideMongolian
      ? 'Tap the mic and say the phrase in Mandarin.'
      : 'Микрофон дараад өгүүлбэрийг хятадаар хэлээрэй';
  }
  const lines = hideMongolian
    ? [
        `Points: ${points}/100`,
        transcript ? `You said: «${transcript}»` : '',
        finalLine ?? '',
        breakdown ?? '',
        passedRound ? 'Result: Pass' : 'Result: Try again',
      ]
    : [
        `Оноо: ${points}/100`,
        transcript ? `Таны хэлсэн: «${transcript}»` : '',
        finalLine ?? '',
        breakdown ?? '',
        passedRound ? 'Дүнд: Тэнцсэн' : 'Дүнд: Тэнцээгүй',
      ];
  return lines.filter(Boolean).join('\n');
}
