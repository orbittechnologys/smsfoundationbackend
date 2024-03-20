import express from 'express';
import { submitTest } from '../controllers/studentTestController.js';

const studentTestRouter = express.Router();

studentTestRouter.route("/submitTest").post(submitTest);

export default studentTestRouter;