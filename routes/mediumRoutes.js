import express from 'express';
import { addMedium, deleteMedium, editMedium, getAllMedium } from '../controllers/mediumController.js';

const mediumRouter = express.Router();

mediumRouter.route("/add").post(addMedium);
mediumRouter.route("/getAll").get(getAllMedium);
mediumRouter.route("/edit").post(editMedium);
mediumRouter.route("/delete/:id").delete(deleteMedium);

export default mediumRouter;