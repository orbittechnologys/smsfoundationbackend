import express from 'express';
import { getTestsForStudent, submitTest } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);
studentTestRouter.route("/getByStudent/:studentId").get(getTestsForStudent);

export default studentTestRouter;