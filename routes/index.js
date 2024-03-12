import expressRouter from 'express';

import userRouter from './userRoutes.js';
import instructorRouter from './instructorRoutes.js';
import subjectRouter from './subjectRoutes.js';
import studentRouter from './studentRoutes.js';
import chapterRouter from './chapterRoutes.js';

const router = expressRouter();

router.use('/user',userRouter);
router.use('/instructor',instructorRouter);
router.use('/subject',subjectRouter);
router.use('/student',studentRouter);
router.use('/chapter',chapterRouter);

export default router;