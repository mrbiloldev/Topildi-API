import { Router } from "express";
import itemsController from "../controllers/items.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const itemRoutes=Router()

itemRoutes
    .get('/items', itemsController.getAllItems)
    .get('/items/:id', itemsController.getOneItem)
    .get('/items/my', itemsController.getMyItems)

    .post('/items',authMiddleware, upload.array("images",3), itemsController.createItem)
    .post('/items/:id/report', authMiddleware, itemsController.reportItem)

    .patch('/items/:id', authMiddleware, itemsController.updateItem)
    .delete('/items/:id', authMiddleware, itemsController.delItem)

export default itemRoutes