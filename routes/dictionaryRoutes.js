import express from "express";
import { hindiDictionary } from "../controllers/dictonaryController.js";

const dictionaryRouter = express.Router();

dictionaryRouter.route("/hindiDictionary/:word").post(hindiDictionary);

export default dictionaryRouter;
