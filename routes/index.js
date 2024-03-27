import expressRouter from 'express';

import userRouter from './userRoutes.js';
import instructorRouter from './instructorRoutes.js';
import subjectRouter from './subjectRoutes.js';
import studentRouter from './studentRoutes.js';
import chapterRouter from './chapterRoutes.js';
import chapterTimeRouter from './chapterTimeRoutes.js';
import testRouter from './testRoutes.js';
import questionRouter from './questionRoutes.js';
import subjectTimeRouter from './subjectTimeRoutes.js';
import studentTestRouter from './studentTestRoutes.js';
import schoolRouter from './schoolRoutes.js'

const router = expressRouter();

router.use('/user',userRouter);
router.use('/instructor',instructorRouter);
router.use('/subject',subjectRouter);
router.use('/student',studentRouter);
router.use('/chapter',chapterRouter);
router.use("/chapterTime",chapterTimeRouter);
router.use("/test",testRouter);
router.use("/question",questionRouter);
router.use("/subjectTime",subjectTimeRouter);
router.use("/studentTest",studentTestRouter);
router.use("/school",schoolRouter);

export default router;