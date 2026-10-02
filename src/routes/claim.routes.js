import { Router } from "express";
import claimsController from "../controllers/claims.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { claimCreateSchema, idParamSchema } from "../validation/claims.validation.js";

const claimRoutes = Router()

claimRoutes
    .get('/claims/my', authMiddleware, allowRoles('user'), claimsController.getMyClaims)
    .get('/items/:id/claims', authMiddleware,allowRoles('user'), validate(idParamSchema, "params"),claimsController.getAllClaims)
    .post('/items/:id/claims', authMiddleware, allowRoles('user'),validate(idParamSchema, "params"), validate(claimCreateSchema, "body"), claimsController.createClaim)
    .patch('/claims/:id/approve',authMiddleware,  allowRoles('user'),validate(idParamSchema, "params"),claimsController.approveClaim)
    .patch('/claims/:id/reject',authMiddleware, allowRoles('user'),validate(idParamSchema, "params"), claimsController.rejectClaim)

export default claimRoutes