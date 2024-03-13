import express from 'express';
import { addSubject, getAllSubjects, getSubjectById, getSubjects } from '../controllers/subjectController.js';

const subjectRouter = express.Router();

subjectRouter.route("/addSubject").post(addSubject);

subjectRouter.route("/getAllSubjects").get(getAllSubjects);

subjectRouter.route("/getSubjects").post(getSubjects);

subjectRouter.route("/id/:subjectId").get(getSubjectById);

export default subjectRouter;

