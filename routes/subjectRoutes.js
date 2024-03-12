import express from 'express';
import { addSubject, getAllSubjects, getSubjects } from '../controllers/subjectController.js';

const subjectRouter = express.Router();

subjectRouter.route("/addSubject").post(addSubject);

subjectRouter.route("/getAllSubjects").get(getAllSubjects);

subjectRouter.route("/getSubjects").post(getSubjects);

export default subjectRouter;

