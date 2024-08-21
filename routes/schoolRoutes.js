import express from 'express';
import {addSchool, getAllSchool, getTotals, getAllDistricts, getSchoolByDistrictSyllabusMedium, getAllSchoolsCSV, getSchoolById, editSchool, deleteSchool} from '../controllers/schoolController.js'

const schoolRouter = express.Router();

schoolRouter.route("/addSchool").post(addSchool);
schoolRouter.route("/getAllSchools").get(getAllSchool);
schoolRouter.route("/getTotals").get(getTotals);
schoolRouter.route("/getDistricts").get(getAllDistricts);
schoolRouter.route("/getSchool").post(getSchoolByDistrictSyllabusMedium);
schoolRouter.route("/getSchoolsCSV").get(getAllSchoolsCSV);
schoolRouter.route("/id/:id").get(getSchoolById);
schoolRouter.route("/editSchool").post(editSchool);
schoolRouter.route("/deleteSchool/:id").delete(deleteSchool)

export default schoolRouter;