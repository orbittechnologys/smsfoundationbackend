import express from 'express';
import { addMedium, getAllMedium } from '../controllers/mediumController.js';

const mediumRouter = express.Router();

mediumRouter.route("/add").post(addMedium);
mediumRouter.route("/getAll").get(getAllMedium);

export default mediumRouter;