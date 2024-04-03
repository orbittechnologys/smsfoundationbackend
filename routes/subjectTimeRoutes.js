import express from 'express';
import { getOverallSubjectReport, getSubjectReportCSV, getSubjectReportOfSchool } from '../controllers/subjectTimeController.js';

const subjectTimeRouter = express.Router();

subjectTimeRouter.route("/getLearningReport").get(getOverallSubjectReport);
subjectTimeRouter.route("/getLearningReportForSchool/:schoolId").get(getSubjectReportOfSchool);
subjectTimeRouter.route("/getCSV").get(getSubjectReportCSV);

export default subjectTimeRouter;