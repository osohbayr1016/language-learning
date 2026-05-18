import type { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { mn } from '../../i18n/mn';
import type { GameType } from '../../lib/api/games';

export type GameMeta = {
  key: GameType;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconSolid: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  href: string;
};

export const GAMES: GameMeta[] = [
  {
    key: 'match',
    title: mn.games.match,
    subtitle: mn.games.matchDesc,
    icon: 'grid-outline',
    iconSolid: 'grid',
    color: colors.accent.purple,
    href: '/games/match',
  },
  {
    key: 'translate',
    title: mn.games.translate,
    subtitle: mn.games.translateDesc,
    icon: 'language-outline',
    iconSolid: 'language',
    color: colors.accent.blue,
    href: '/games/translate',
  },
  {
    key: 'sentence',
    title: mn.games.sentence,
    subtitle: mn.games.sentenceDesc,
    icon: 'text-outline',
    iconSolid: 'text',
    color: colors.accent.teal,
    href: '/games/sentence',
  },
  {
    key: 'arrange',
    title: mn.games.arrange,
    subtitle: mn.games.arrangeDesc,
    icon: 'git-compare-outline',
    iconSolid: 'git-compare',
    color: colors.accent.amber,
    href: '/games/arrange',
  },
  {
    key: 'stroke',
    title: mn.games.stroke,
    subtitle: mn.games.strokeDesc,
    icon: 'pencil-outline',
    iconSolid: 'pencil',
    color: colors.accent.pink,
    href: '/games/stroke',
  },
];

export function gameByKey(key: GameType | undefined | null): GameMeta {
  return GAMES.find((g) => g.key === key) ?? GAMES[0];
}
