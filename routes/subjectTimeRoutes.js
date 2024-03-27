import express from 'express';
import { getOverallSubjectReport, getSubjectReportOfSchool } from '../controllers/subjectTimeController.js';

const subjectTimeRouter = express.Router();

subjectTimeRouter.route("/getLearningReport").get(getOverallSubjectReport);
subjectTimeRouter.route("/getLearningReportForSchool/:schoolId").get(getSubjectReportOfSchool);

export default subjectTimeRouter;