import express from 'express';
import { addInstructor, editInstructor, fetchAllInstructorsCSV, fetchInstructorById, fetchStudentsByInstructorId, getAllInstructor, getInstructorByUserId, resetPassword } from '../controllers/instructorController.js';

const instructorRouter = express.Router();

instructorRouter.route("/addInstructor").post(addInstructor);
instructorRouter.route("/getByUserId/:userId").get(getInstructorByUserId);
instructorRouter.route("/getAll").get(getAllInstructor);
instructorRouter.route("/resetPassword").post(resetPassword);
instructorRouter.route("/fetchStudents/:instructorId").get(fetchStudentsByInstructorId);
instructorRouter.route("/getInstructorsCSV").get(fetchAllInstructorsCSV);
instructorRouter.route("/id/:id").get(fetchInstructorById);
instructorRouter.route("/editInstructor").post(editInstructor);

export default instructorRouter;