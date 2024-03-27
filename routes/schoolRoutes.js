import express from 'express';
import {addSchool, getAllSchool, getTotals} from '../controllers/schoolController.js'

const schoolRouter = express.Router();

schoolRouter.route("/addSchool").post(addSchool);
schoolRouter.route("/getAllSchools").get(getAllSchool);
schoolRouter.route("/getTotals").get(getTotals);

export default schoolRouter;