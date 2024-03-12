import express from 'express';
import { addStudent } from '../controllers/studentController.js';

const studentRouter =express.Router();

studentRouter.route("/addStudent").post(addStudent);

export default studentRouter;