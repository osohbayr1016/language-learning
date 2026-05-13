import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';
import type { Env, Variables } from '../../types';
import { registerStatsRoutes } from './statsRoutes';
import { registerChapterRoutes } from './chaptersRoutes';
import { registerLessonRoutes } from './lessonsRoutes';
import { registerLessonWordRoutes } from './lessonWordsRoutes';
import { registerLessonHtmlImportRoutes } from './lessonHtmlImportRoutes';
import usersWordsRoutes from './usersWordsRoutes';

const admin = new Hono<{ Bindings: Env; Variables: Variables }>();

admin.use('*', authMiddleware);
admin.use('*', adminMiddleware);

registerStatsRoutes(admin);
registerChapterRoutes(admin);
registerLessonWordRoutes(admin);
registerLessonRoutes(admin);
registerLessonHtmlImportRoutes(admin);
admin.route('/', usersWordsRoutes);

export default admin;
