import express from 'express';
import { addTest, getTest, getTestByChapter } from '../controllers/testController.js';

const testRouter = express.Router();

testRouter.route("/addTest").post(addTest);
testRouter.route("/getTestsForChapter/:chapterId").get(getTestByChapter);
testRouter.route("/id/:testId").get(getTest);

export default testRouter;
