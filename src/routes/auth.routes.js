import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRoutes=Router()


authRoutes 
    .get('/auth/me', authController.me)

    .post('/auth/register', authController.register)
    .post('/auth/login', authController.login)
    .post('/auth/verify', authController.verify)
    .post('/auth/resendCode', authController.resendOtp)
    .post('/auth/forgotPassword', authController.forgotPass)
    .post('/auth/resetPassword', authController.resetPass)
    

export default authRoutes