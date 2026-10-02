import { Router } from "express";
import itemsController from "../controllers/items.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createItemSchema, getItemsQuerySchema, reportItemSchema, updateItemSchema } from "../validation/item.validation.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { idParamSchema } from "../validation/claims.validation.js";

const itemRoutes=Router()

itemRoutes
    .get('/items', validate(getItemsQuerySchema, "query"), itemsController.getAllItems)
    .get('/items/my',authMiddleware, allowRoles('user',"admin"), itemsController.getMyItems)
    .get('/items/:id', validate(idParamSchema, "params"), itemsController.getOneItem)

    .post('/items',authMiddleware,allowRoles('user','admin'), upload.array("images",3), validate(createItemSchema), itemsController.createItem)
    .post('/items/:id/report', authMiddleware,allowRoles('user','admin'),validate(idParamSchema, "params"),validate(reportItemSchema), itemsController.reportItem)

    .patch('/items/:id', authMiddleware,allowRoles('user','admin'),validate(idParamSchema, "params"), validate(updateItemSchema), itemsController.updateItem)
    .delete('/items/:id', authMiddleware,allowRoles('user','admin'),validate(idParamSchema, "params"), itemsController.delItem)

export default itemRoutes