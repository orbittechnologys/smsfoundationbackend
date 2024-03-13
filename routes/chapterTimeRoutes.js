import express from 'express';
import { updateChapterTime } from '../controllers/chapterTimeController.js';

const chapterTimeRouter = express.Router();

chapterTimeRouter.route("/update").post(updateChapterTime);

export default chapterTimeRouter;