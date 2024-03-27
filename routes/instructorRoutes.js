import express from 'express';
import { addInstructor, getInstructorByUserId } from '../controllers/instructorController.js';

const instructorRouter = express.Router();

instructorRouter.route("/addInstructor").post(addInstructor);
instructorRouter.route("/getByUserId/:userId").get(getInstructorByUserId);

export default instructorRouter;