import express from 'express';
import { addInstructor, getAllInstructor, getInstructorByUserId } from '../controllers/instructorController.js';

const instructorRouter = express.Router();

instructorRouter.route("/addInstructor").post(addInstructor);
instructorRouter.route("/getByUserId/:userId").get(getInstructorByUserId);
instructorRouter.route("/getAll").get(getAllInstructor);

export default instructorRouter;