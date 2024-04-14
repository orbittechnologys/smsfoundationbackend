import express from 'express';
import { addStudent, getStudentByUserId , updateStudent, getStudent, getStudentsBySchool, getStudentsQuery, getStudentsQueryViaSchool, resetPassword, getAllStudents, fetchCountGenders, fetchAllStudentsCSV, uploadStudentsCSV} from '../controllers/studentController.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const uploadCsv = multer({ storage });

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
studentRouter.route("/getStudentsCSV").get(fetchAllStudentsCSV);
studentRouter.route('/uploadStudentsCSV/:schoolId').post(uploadCsv.single('file'), uploadStudentsCSV);

export default studentRouter;