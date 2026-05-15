import type { User } from './auth';

export interface UserWordProgress {
  id: number;
  user_id: number;
  word_id: number;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  last_reviewed: string;
  created_at: string;
}

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  word_id: number;
  rating: ReviewRating;
  response_time_ms: number;
}

export interface StudySession {
  session_type: 'flashcard' | 'learn' | 'write' | 'test';
  results: ReviewResult[];
  total_time_ms: number;
  xp_earned: number;
}

export interface UserStreak {
  user_id: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  total_days_studied: number;
}

export interface UserStats {
  user_id: number;
  total_xp: number;
  words_learned: number;
  words_mastered: number;
  total_reviews: number;
}

export interface UserDashboard {
  user: User;
  streak: UserStreak;
  stats: UserStats;
  due_today: number;
  new_words_today: number;
}
