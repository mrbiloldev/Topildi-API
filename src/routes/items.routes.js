import { Router } from "express";
import itemsController from "../controllers/items.controller.js";

const itemRoutes=Router()

itemRoutes
    .get('/items', itemsController.getAllItems)
    .get('/items/:id', itemsController.getOneItem)
    .get('/items/my', itemsController.getMyItems)

    .post('/items', itemsController.createItem)
    .post('/items/:id/report', itemsController.reportItem)

    .put('/items/:id', itemsController.updateItem)
    .delete('/items/:id', itemsController.delItem)

export default itemRoutes