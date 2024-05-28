import express from 'express';
import { getUser, login, register, resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/id/:userId").get(getUser);
userRouter.route('/resetPassword').post(resetPassword);

export default userRouter;