import express from 'express';
import { getTestReport, getTestResults, getTestsForStudent, submitTest } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);
studentTestRouter.route("/getByStudent/:studentId").get(getTestsForStudent);
studentTestRouter.route("/testReport").get(getTestReport);
studentTestRouter.route("/getResults").post(getTestResults);

export default studentTestRouter;