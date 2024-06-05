import express from "express";
import {
  addSubject,
  deleteSubject,
  editSubject,
  getAllSubjects,
  getSubjectById,
  getSubjects,
} from "../controllers/subjectController.js";

const subjectRouter = express.Router();

subjectRouter.route("/addSubject").post(addSubject);
subjectRouter.route("/getAllSubjects").get(getAllSubjects);
subjectRouter.route("/getSubjects").post(getSubjects);
subjectRouter.route("/id/:subjectId").get(getSubjectById);
subjectRouter.route("/edit").post(editSubject);
subjectRouter.route("/delete/:id").delete(deleteSubject);

export default subjectRouter;
