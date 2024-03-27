import express from 'express';
import {addSchool, getAllSchool} from '../controllers/schoolController.js'

const schoolRouter = express.Router();

schoolRouter.route("/addSchool").post(addSchool);
schoolRouter.route("/getAllSchools").get(getAllSchool);

export default schoolRouter;