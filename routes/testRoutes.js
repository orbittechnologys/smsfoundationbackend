import express from 'express';
import { addTest, getTestByChapter } from '../controllers/testController.js';

const testRouter = express.Router();

testRouter.route("/addTest").post(addTest);
testRouter.route("/getTestsForChapter/:chapterId").get(getTestByChapter);

export default testRouter;
