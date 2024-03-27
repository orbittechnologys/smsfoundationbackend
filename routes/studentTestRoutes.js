import express from 'express';
import { getTestReport, getTestResults, getTestsForStudent, submitTest,getLearningReportForSchool } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);
studentTestRouter.route("/getByStudent/:studentId").get(getTestsForStudent);
studentTestRouter.route("/testReport").get(getTestReport);
studentTestRouter.route("/testReportForSchool/:schoolId").get(getLearningReportForSchool);
studentTestRouter.route("/getResults").post(getTestResults);

export default studentTestRouter;