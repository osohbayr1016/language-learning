import type { ComponentProps } from 'react';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export type HubRowDef = {
  key: string;
  label: string;
  hint: string;
  href: Href;
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
};

export type HubSectionDef = { title: string; items: HubRowDef[] };
