import express from 'express';
import { addStudent, getStudentByUserId , updateStudent, getStudent} from '../controllers/studentController.js';

const studentRouter =express.Router();

studentRouter.route("/addStudent").post(addStudent);

studentRouter.route("/getStudentByUserId/:userId").get(getStudentByUserId);
studentRouter.route("/updateStudent").post(updateStudent);
studentRouter.route("/id/:studentId").get(getStudent);

export default studentRouter;