import express from 'express';
import {addSchool, getAllSchool, getTotals, getAllDistricts, getSchoolByDistrictSyllabusMedium, getAllSchoolsCSV} from '../controllers/schoolController.js'

const schoolRouter = express.Router();

schoolRouter.route("/addSchool").post(addSchool);
schoolRouter.route("/getAllSchools").get(getAllSchool);
schoolRouter.route("/getTotals").get(getTotals);
schoolRouter.route("/getDistricts").get(getAllDistricts);
schoolRouter.route("/getSchool").post(getSchoolByDistrictSyllabusMedium);
schoolRouter.route("/getSchoolsCSV").get(getAllSchoolsCSV);

export default schoolRouter;