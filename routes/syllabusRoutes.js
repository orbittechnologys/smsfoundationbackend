import express from 'express';
import { addSyllabus, getAllSyllabus } from '../controllers/syllabusController.js';

const syllabusRouter = express.Router();

syllabusRouter.route("/add").post(addSyllabus);
syllabusRouter.route("/getAll").get(getAllSyllabus);

export default syllabusRouter;