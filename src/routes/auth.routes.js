import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resendCodeSchema, resetPasswordSchema, verifySchema } from "../validation/auth.validation.js";
import { allowRoles } from "../middleware/role.middleware.js";

const authRoutes=Router()


authRoutes 
    .get('/auth/me', authMiddleware,allowRoles('user', 'admin'), authController.me)

    .post('/auth/register', validate(registerSchema), authController.register)
    .post('/auth/login', validate(loginSchema), authController.login)
    .post('/auth/verify', validate(verifySchema), authController.verify)
    .post('/auth/resendCode',validate(resendCodeSchema), authController.resendOtp)
    .post('/auth/forgotPassword', validate(forgotPasswordSchema), authController.forgotPass)
    .post('/auth/resetPassword', validate(resetPasswordSchema), authController.resetPass)
    

export default authRoutes