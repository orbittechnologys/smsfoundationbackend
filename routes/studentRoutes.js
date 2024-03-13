import express from 'express';
import { addStudent, getStudentByUserId } from '../controllers/studentController.js';

const studentRouter =express.Router();

studentRouter.route("/addStudent").post(addStudent);

studentRouter.route("/getStudentByUserId/:userId").get(getStudentByUserId);

export default studentRouter;