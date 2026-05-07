import { auth } from './auth';
import { user } from './user';
import { words } from './words';
import { courses } from './courses';
import { games } from './games';
import { cartoons } from './cartoons';
import { audio } from './audio';
import { lessons } from './lessons';
import { insights } from './insights';

export const api = {
  auth,
  user,
  words,
  courses,
  games,
  cartoons,
  audio,
  lessons,
  insights,
};

export type { AuthTokens, LoginBody, RegisterBody } from './auth';
export type { Dashboard, Streak, Stats, ProgressBody } from './user';
export type { Course } from './courses';
export type { GameSessionBody, GameType, LeaderboardRow } from './games';
export type { Cartoon, CartoonDetail, CartoonWord } from './cartoons';
export type { LessonCompleteBody } from './lessons';
export { API_BASE } from './client';
