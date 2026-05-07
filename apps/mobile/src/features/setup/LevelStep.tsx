import React from 'react';
import { View } from 'react-native';
import { MascotBubble } from './MascotBubble';
import { OptionCard } from './OptionCard';
import { mn } from '../../i18n/mn';
import type { ChineseLevel } from './types';

type Item = { id: ChineseLevel; title: string; subtitle: string };

const ITEMS: Item[] = [
  { id: 'none', title: mn.setup.levelNoneTitle, subtitle: mn.setup.levelNoneSub },
  { id: 'hsk1', title: mn.setup.levelHsk.replace('{n}', '1'), subtitle: mn.setup.levelHsk1 },
  { id: 'hsk2', title: mn.setup.levelHsk.replace('{n}', '2'), subtitle: mn.setup.levelHsk2 },
  { id: 'hsk3', title: mn.setup.levelHsk.replace('{n}', '3'), subtitle: mn.setup.levelHsk3 },
  { id: 'hsk4', title: mn.setup.levelHsk.replace('{n}', '4'), subtitle: mn.setup.levelHsk4 },
  { id: 'hsk5', title: mn.setup.levelHsk.replace('{n}', '5'), subtitle: mn.setup.levelHsk5 },
  { id: 'hsk6', title: mn.setup.levelHsk.replace('{n}', '6'), subtitle: mn.setup.levelHsk6 },
];

type Props = {
  value: ChineseLevel | null;
  onChange: (v: ChineseLevel) => void;
};

export function LevelStep({ value, onChange }: Props) {
  return (
    <View>
      <MascotBubble message={mn.setup.levelTitle} />
      {ITEMS.map((it) => (
        <OptionCard
          key={it.id}
          title={it.title}
          subtitle={it.subtitle}
          selected={value === it.id}
          onPress={() => onChange(it.id)}
        />
      ))}
    </View>
  );
}
