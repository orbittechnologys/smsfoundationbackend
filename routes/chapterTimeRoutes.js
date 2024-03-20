import express from 'express';
import { getChapterTimeForStudent, updateChapterTime } from '../controllers/chapterTimeController.js';

const chapterTimeRouter = express.Router();

chapterTimeRouter.route("/update").post(updateChapterTime);
chapterTimeRouter.route("/getForStudent/:studentId").get(getChapterTimeForStudent);

export default chapterTimeRouter;