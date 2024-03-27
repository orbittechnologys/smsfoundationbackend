import express from 'express';
import {addSchool, getAllSchool, getTotals, getAllDistricts} from '../controllers/schoolController.js'

const schoolRouter = express.Router();

schoolRouter.route("/addSchool").post(addSchool);
schoolRouter.route("/getAllSchools").get(getAllSchool);
schoolRouter.route("/getTotals").get(getTotals);
schoolRouter.route("/getDistricts").get(getAllDistricts);

export default schoolRouter;