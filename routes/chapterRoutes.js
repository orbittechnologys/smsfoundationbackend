import express from 'express';
import { addChapter, deleteChapter, getChapter, getChapterQuery, getChaptersBySubject, getChapterTestsByStudentId, updateChapter } from '../controllers/chapterController.js';

const chapterRouter = express.Router();

chapterRouter.route("/addChapter").post(addChapter);
chapterRouter.route("/id/:chapterId").get(getChapter);
chapterRouter.route("/getChapterBySubject/:subjectId").get(getChaptersBySubject);
chapterRouter.route("/query/:query").get(getChapterQuery);
chapterRouter.route("/update").post(updateChapter);
chapterRouter.route("/delete/:id").delete(deleteChapter);
chapterRouter.route("/getChapterTests/:studentId").get(getChapterTestsByStudentId);

export default chapterRouter;