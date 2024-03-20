import express from 'express';
import { addQuestion, editQuestion, getQuestionsForTest } from '../controllers/questionController.js';

const questionRouter = express.Router();

questionRouter.route("/addQuestion").post(addQuestion);
questionRouter.route("/getQuestions/:testId").get(getQuestionsForTest);
questionRouter.route("/editQuestion").post(editQuestion);

export default questionRouter;