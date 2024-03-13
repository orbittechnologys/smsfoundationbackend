import express from 'express';
import { addChapter, getChapter, getChaptersBySubject } from '../controllers/chapterController.js';

const chapterRouter = express.Router();

chapterRouter.route("/addChapter").post(addChapter);
chapterRouter.route("/id/:chapterId").get(getChapter);
chapterRouter.route("/getChapterBySubject/:subjectId").get(getChaptersBySubject);

export default chapterRouter;