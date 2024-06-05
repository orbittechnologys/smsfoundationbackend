import express from 'express';
import { addSyllabus, deleteSyllabus, editSyllabus, getAllSyllabus } from '../controllers/syllabusController.js';

const syllabusRouter = express.Router();

syllabusRouter.route("/add").post(addSyllabus);
syllabusRouter.route("/getAll").get(getAllSyllabus);
syllabusRouter.route('/edit').post(editSyllabus);
syllabusRouter.route('/delete/:id').delete(deleteSyllabus);

export default syllabusRouter;