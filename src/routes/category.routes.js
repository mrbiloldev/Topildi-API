import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validation/category.validation.js";
import { idParamSchema } from "../validation/claims.validation.js";

const categoryRoutes = Router()

categoryRoutes
    .get('/categories', categoryController.getAll)
    .post('/categories', authMiddleware,allowRoles('admin'),validate(createCategorySchema), categoryController.createCat)
    .put('/categories/:id', authMiddleware,allowRoles('admin'), validate(idParamSchema, "params"), validate(updateCategorySchema), categoryController.update)
    .delete('/categories/:id',authMiddleware,allowRoles('admin'), validate(idParamSchema, "params"), categoryController.delCat)


export default categoryRoutes