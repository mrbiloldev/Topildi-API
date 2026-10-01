import { Router } from "express";
import claimsController from "../controllers/claims.controller.js";

const claimRoutes = Router()

claimRoutes
    .get('/claims/my', claimsController.getMyClaims)
    .get('/items/:id/claims', claimsController.getAllClaims)
    .post('/items/:id/claims', claimsController.createClaim)
    .patch('/claims/:id/approve',claimsController.approveClaim)
    .patch('/claims/:id/reject', claimsController.rejectClaim)

export default claimRoutes