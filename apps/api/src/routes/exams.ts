import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { registerExamStartRoutes } from './exams/examStartRoutes';
import { registerExamSubmitRoute } from './exams/examSubmitRoutes';

const examsApp = new Hono<{ Bindings: Env; Variables: Variables }>();
examsApp.use('*', authMiddleware);

registerExamStartRoutes(examsApp);
registerExamSubmitRoute(examsApp);

export default examsApp;
