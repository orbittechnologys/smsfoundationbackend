import express from 'express';
import { getChapterTimeForStudent, updateChapterTime, getChapterTime } from '../controllers/chapterTimeController.js';

const chapterTimeRouter = express.Router();

chapterTimeRouter.route("/update").post(updateChapterTime);
chapterTimeRouter.route("/getForStudent/:studentId").get(getChapterTimeForStudent);
chapterTimeRouter.route("/getForChapterStudent").post(getChapterTime);

export default chapterTimeRouter;