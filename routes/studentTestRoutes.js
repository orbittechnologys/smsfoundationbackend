import express from 'express';
import { getTestReport, getTestResults, getTestsForStudent, submitTest,getTestReportForSchool, getTestReportCSV, getTestReportSchoolCSV, fetchLatestStudentTests, getTestResult, getTestReportForStudent, getLearningReportForStudent } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);
studentTestRouter.route("/getByStudent/:studentId").get(getTestsForStudent);
studentTestRouter.route("/testReport").get(getTestReport);
studentTestRouter.route("/testReportForSchool/:schoolId").get(getTestReportForSchool);
studentTestRouter.route("/getResults").post(getTestResults);
studentTestRouter.route("/getCSV").get(getTestReportCSV);
studentTestRouter.route("/testReportCSVForSchool/:schoolId").get(getTestReportSchoolCSV);
studentTestRouter.route("/activity/:studentId").get(fetchLatestStudentTests);
studentTestRouter.route("/getTestResult").get(getTestResult);
studentTestRouter.route("/getTestReportForStudent/:studentId").get(getTestReportForStudent);
studentTestRouter.route("/getLearningReportForStudent/:studentId").get(getLearningReportForStudent);

export default studentTestRouter;