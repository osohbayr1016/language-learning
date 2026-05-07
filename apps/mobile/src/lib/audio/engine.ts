export type GestureKind = 'tap' | 'hold' | 'doubleTap';

export type PronounceAction =
  | { kind: 'tap'; speed: 'normal' }
  | { kind: 'hold'; speed: 'slow' }
  | { kind: 'doubleTap'; speed: 'normal'; repeat: number };

const REPEAT_COUNT = 3;

export function gestureToAction(kind: GestureKind): PronounceAction {
  switch (kind) {
    case 'tap':
      return { kind: 'tap', speed: 'normal' };
    case 'hold':
      return { kind: 'hold', speed: 'slow' };
    case 'doubleTap':
      return { kind: 'doubleTap', speed: 'normal', repeat: REPEAT_COUNT };
  }
}
