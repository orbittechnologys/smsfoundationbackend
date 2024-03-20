import express from 'express';
import { getOverallSubjectReport } from '../controllers/subjectTimeController.js';

const subjectTimeRouter = express.Router();

subjectTimeRouter.route("/getLearningReport").get(getOverallSubjectReport);

export default subjectTimeRouter;