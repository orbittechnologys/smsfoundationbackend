import express from 'express';
import { getUser, login, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/id/:userId").get(getUser);

export default userRouter;