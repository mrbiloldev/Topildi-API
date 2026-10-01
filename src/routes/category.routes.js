import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const categoryRoutes = Router()

categoryRoutes
    .get('/categories', categoryController.getAll)
    .post('/categories', categoryController.createCat)
    .put('categories/:id', categoryController.update)
    .delete('categories/:id', categoryController.delCat)


export default categoryRoutes