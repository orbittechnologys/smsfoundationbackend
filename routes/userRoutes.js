import express from 'express';
import { checkUsernamePresent, createLocalAdmin, getUser, login, register, resetPassword, triggerOtp } from '../controllers/userController.js';
import { getMetrics } from '../controllers/metricsController.js';

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/id/:userId").get(getUser);
userRouter.route('/resetPassword').post(resetPassword); 
userRouter.route("/localAdmin").post(createLocalAdmin);
userRouter.route('/checkUsername/:username').get(checkUsernamePresent);
userRouter.route("/metrics").get(getMetrics);
userRouter.route("/triggerOtp").post(triggerOtp);

export default userRouter;