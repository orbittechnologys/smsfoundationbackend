import express from 'express';
import { addChapter } from '../controllers/chapterController.js';

const chapterRouter = express.Router();

chapterRouter.route("/addChapter").post(addChapter);

export default chapterRouter;