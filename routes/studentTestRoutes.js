import express from 'express';
import { getTestReport, getTestsForStudent, submitTest } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);
studentTestRouter.route("/getByStudent/:studentId").get(getTestsForStudent);
studentTestRouter.route("/testReport").get(getTestReport);

export default studentTestRouter;