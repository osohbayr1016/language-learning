import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { colors, radius } from '../../theme';

export type HanziWriterMode = 'animate' | 'quiz' | 'show';

export type HanziWriterEvent =
  | { type: 'ready' }
  | { type: 'mistake'; strokeNum: number; mistakesOnStroke: number }
  | { type: 'strokeComplete'; strokeNum: number; isCorrect: boolean }
  | { type: 'complete'; totalMistakes: number; strokes: number };

type Props = {
  char: string;
  mode: HanziWriterMode;
  size?: number;
  strokeColor?: string;
  outlineColor?: string;
  onEvent?: (e: HanziWriterEvent) => void;
};

export type HanziWriterHandle = {
  reset: () => void;
};

function buildHtml(
  char: string,
  mode: HanziWriterMode,
  bg: string,
  stroke: string,
  outline: string
): string {
  const escaped = char.replace(/[\\"]/g, '\\$&');
  return `<!doctype html><html><head><meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>html,body{margin:0;padding:0;background:${bg};height:100%;display:flex;align-items:center;justify-content:center;}#t{width:100%;height:100%;}</style>
<script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script></head>
<body><div id="t"></div>
<script>
const post = (m) => window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(m));
let writer = null;
function start() {
  const el = document.getElementById('t');
  const size = Math.min(el.clientWidth, el.clientHeight);
  writer = HanziWriter.create('t', '${escaped}', {
    width: size, height: size, padding: 8,
    showOutline: true, showCharacter: ${mode === 'show'},
    strokeColor: '${stroke}', outlineColor: '${outline}', radicalColor: '${stroke}',
    delayBetweenStrokes: 220, strokeAnimationSpeed: 1.2, drawingWidth: 30
  });
  post({ type: 'ready' });
  if ('${mode}' === 'animate') {
    writer.loopCharacterAnimation();
  } else if ('${mode}' === 'quiz') {
    let totalMistakes = 0; let strokes = 0;
    writer.quiz({
      onMistake: (info) => { totalMistakes++; post({ type: 'mistake', strokeNum: info.strokeNum, mistakesOnStroke: info.mistakesOnStroke }); },
      onCorrectStroke: (info) => { strokes++; post({ type: 'strokeComplete', strokeNum: info.strokeNum, isCorrect: true }); },
      onComplete: (s) => { post({ type: 'complete', totalMistakes: s.totalMistakes, strokes }); }
    });
  }
}
window.addEventListener('load', start);
</script></body></html>`;
}

export const HanziWriterView = forwardRef<HanziWriterHandle, Props>(function HanziWriterView(
  { char, mode, size = 280, strokeColor = colors.text.primary, outlineColor = colors.borderLight, onEvent },
  ref
) {
  const wvRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    reset: () => wvRef.current?.reload(),
  }), []);

  const html = useMemo(
    () => buildHtml(char, mode, colors.bg.card, strokeColor, outlineColor),
    [char, mode, strokeColor, outlineColor]
  );

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data) as HanziWriterEvent;
      onEvent?.(msg);
    } catch {
      /* ignore */
    }
  };

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <WebView
        ref={wvRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.wv}
        scrollEnabled={false}
        onMessage={onMessage}
        javaScriptEnabled
        androidLayerType="hardware"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  wv: { flex: 1, backgroundColor: 'transparent' },
});
