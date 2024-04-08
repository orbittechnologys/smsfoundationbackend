import express from 'express';
import { addStudent, getStudentByUserId , updateStudent, getStudent, getStudentsBySchool, getStudentsQuery, getStudentsQueryViaSchool, resetPassword, getAllStudents, fetchCountGenders} from '../controllers/studentController.js';

const studentRouter =express.Router();

studentRouter.route("/addStudent").post(addStudent);

studentRouter.route("/getStudentByUserId/:userId").get(getStudentByUserId);
studentRouter.route("/updateStudent").post(updateStudent);
studentRouter.route("/id/:studentId").get(getStudent);
studentRouter.route("/getStudentsBySchool/:schoolId").get(getStudentsBySchool);  
studentRouter.route("/getStudentsQuery/:query").get(getStudentsQuery);
studentRouter.route("/getStudentQuerySchool").get(getStudentsQueryViaSchool);
studentRouter.route("/resetPassword").post(resetPassword);
studentRouter.route("/getAll").get(getAllStudents);
studentRouter.route("/genderRatio/:district").get(fetchCountGenders);

export default studentRouter;