import React from 'react';
import { Text, View } from 'react-native';
import { MascotBubble } from './MascotBubble';
import { OptionCard } from './OptionCard';
import { mn } from '../../i18n/mn';
import type { LearningReason } from './types';

type Item = { id: LearningReason; title: string; subtitle: string; icon: string };

const ITEMS: Item[] = [
  { id: 'university', title: mn.setup.reasonUniversity, subtitle: mn.setup.reasonUniversitySub, icon: '🎓' },
  { id: 'career', title: mn.setup.reasonCareer, subtitle: mn.setup.reasonCareerSub, icon: '💼' },
  { id: 'travel', title: mn.setup.reasonTravel, subtitle: mn.setup.reasonTravelSub, icon: '✈️' },
  { id: 'culture', title: mn.setup.reasonCulture, subtitle: mn.setup.reasonCultureSub, icon: '🏮' },
  { id: 'fun', title: mn.setup.reasonFun, subtitle: mn.setup.reasonFunSub, icon: '🎨' },
];

type Props = {
  value: LearningReason | null;
  onChange: (v: LearningReason) => void;
};

export function ReasonStep({ value, onChange }: Props) {
  return (
    <View>
      <MascotBubble message={mn.setup.reasonTitle} />
      {ITEMS.map((it) => (
        <OptionCard
          key={it.id}
          title={it.title}
          subtitle={it.subtitle}
          selected={value === it.id}
          onPress={() => onChange(it.id)}
          icon={<Text style={{ fontSize: 28 }}>{it.icon}</Text>}
        />
      ))}
    </View>
  );
}
