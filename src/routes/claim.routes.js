import { Router } from "express";
import claimsController from "../controllers/claims.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const claimRoutes = Router()

claimRoutes
    .get('/claims/my', authMiddleware, claimsController.getMyClaims)
    .get('/items/:id/claims', authMiddleware,claimsController.getAllClaims)
    .post('/items/:id/claims', authMiddleware, claimsController.createClaim)
    .patch('/claims/:id/approve',authMiddleware,claimsController.approveClaim)
    .patch('/claims/:id/reject',authMiddleware, claimsController.rejectClaim)

export default claimRoutes