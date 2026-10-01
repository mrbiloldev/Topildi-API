import { ILike } from "typeorm"
import { AppData } from "../config/data-source.js"
import { Category } from "../entities/category.entity.js"

const catRepo = AppData.getRepository(Category)

class CategoryController {
   async getAll(req, res, next) {
      try {
         const data = await catRepo.find()

         return res.json({
            success: true,
            data: data
         })
      } catch (err) {
         next(err)
      }
   }
   async createCat(req, res, next) {
      try {
         const { name } = req.body
         const data = await catRepo.findOne({ where: { name: ILike(name.trim()) } })

         if (data) {
            return res.status(409).json({
               success: false,
               message: "Bunday kategoriya allaqachon mavjud"
            });
         }

         const createCat = await catRepo.create({ name })
         const savedCat = await catRepo.save(createCat)

         return res.status(201).json({
            success: true,
            message: "Category created",
            data: savedCat
         })

      } catch (err) {
         next(err)
      }
   }
   async update(req, res, next) {
      try {
         const id = Number(req.params.id)
         const { name } = req.body
         const data = await catRepo.findOne({ where: { id } })

         if (!data) {
            return res.status(404).json({
               success: false,
               message: "Data not found"
            })
         }

         const check = await catRepo.findOne({ where: { name: ILike(name.trim()) } })

         if (check) {
            return res.status(409).json({
               success: false,
               message: "Bunday kategoriya allaqachon mavjud"
            });
         }

         data.name = name

         const updatedData = await catRepo.save(data)

         res.json({
            success: true,
            message: `Category with ${id} id updated`,
            data: updatedData
         })

      } catch (err) {
         next(err)
      }
   }
   async delCat(req, res, next) {
      try {
         const id = Number(req.params.id)
         const data = await catRepo.findOne({ where: { id } })

         if (!data) {
            return res.status(404).json({
               success: false,
               message: "Data not found"
            })
         }
         
         await catRepo.remove(data)

          res.json({
                success: true,
                message: `Data with ${id} id deleted`
            })

      } catch (err) {
         next(err)
      }
   }
}


export default new CategoryController