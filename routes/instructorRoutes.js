import express from 'express';
import { addInstructor } from '../controllers/instructorController.js';

const instructorRouter = express.Router();

instructorRouter.route("/addInstructor").post(addInstructor);

export default instructorRouter;