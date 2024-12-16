import express from 'express';
import { addTest, getTest, getTestByChapter, uploadTestFile } from '../controllers/testController.js';

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const uploadCsv = multer({ storage });

const testRouter = express.Router();

testRouter.route("/addTest").post(addTest);
testRouter.route("/getTestsForChapter/:chapterId").get(getTestByChapter);
testRouter.route("/id/:testId").get(getTest);

testRouter.route('/uploadTestFile/:chapterId').post(uploadCsv.single('file'), uploadTestFile);


export default testRouter;
