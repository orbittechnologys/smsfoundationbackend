import express from 'express';
import { checkUsernamePresent, createLocalAdmin, getUser, login, register, resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/id/:userId").get(getUser);
userRouter.route('/resetPassword').post(resetPassword); 
userRouter.route("/localAdmin").post(createLocalAdmin);
userRouter.route('/checkUsername/:username').get(checkUsernamePresent);

export default userRouter;