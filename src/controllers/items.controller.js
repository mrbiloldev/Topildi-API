import { AppData } from "../config/data-source.js"
import { messageEmail } from "../config/mailer.js"
import { Category } from "../entities/category.entity.js"
import { ItemImage } from "../entities/item-images.entity.js"
import { Item } from "../entities/items.entity.js"
import { User } from "../entities/user.entity.js"
import { hashPassword } from "../helpers/hash.js"
import fs from "fs"
import path from "path"

const itemRepo = AppData.getRepository(Item)
const itemImageRepo = AppData.getRepository(ItemImage)
const userRepo = AppData.getRepository(User)
const catRepo = AppData.getRepository(Category)

class ItemController {
    async getAllItems(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const [data, total] = await itemRepo.findAndCount({
                skip,
                take: limit,
                order: {
                    id: "DESC"
                },
                relations: {
                    images: true,
                    user: true,
                    category: true
                }
            });

            return res.json({
                success: true,
                data,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            });

        } catch (err) {
            next(err);
        }
    }
    async getOneItem(req, res, next) {
        try {
            const id = Number(req.params.id);

            const item = await itemRepo.findOne({
                where: { id },
                relations: {
                    images: true,
                    user: true,
                    category: true
                }
            });

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Data not found"
                });
            }

            return res.json({
                success: true,
                data: item
            });

        } catch (err) {
            next(err);
        }
    }
    async getMyItems(req, res, next) {
        try {
            const userId = Number(req.user.id);

            const items = await itemRepo.find({
                where: {
                    user_id: userId
                },
                order: {
                    id: "DESC"
                },
                relations: {
                    images: true,
                    category: true
                }
            });

            return res.json({
                success: true,
                data: items
            });

        } catch (err) {
            next(err);
        }
    }
    async createItem(req, res, next) {
        try {
            const {
                title,
                description,
                location,
                category_id,
                type,
                event_date,
                secret_question,
                secret_answer
            } = req.body;

            const userId = Number(req.user.id);

            if (!req.files || req.files.length < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Kamida 1 ta rasm yuklash kerak"
                });
            }

            if (type === "found") {
                if (!secret_question || !secret_answer) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Topilgan item uchun secret_question va secret_answer kerak"
                    });
                }
            }

            const category = await catRepo.findOne({
                where: {
                    id: Number(category_id)
                }
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            let hashedAnswer = null;

            if (type === "found") {
                hashedAnswer = await hashPassword(
                    secret_answer.trim().toLowerCase()
                );
            }

            const item = itemRepo.create({
                user_id: userId,
                category_id: Number(category_id),
                type,
                title,
                description,
                location,
                event_date,
                secret_question,
                secret_answer: hashedAnswer
            });

            const savedItem = await itemRepo.save(item);

            const images = [];

            for (const file of req.files) {
                const image = itemImageRepo.create({
                    item_id: savedItem.id,
                    filename: file.filename
                });

                const savedImage =
                    await itemImageRepo.save(image);

                images.push(savedImage);
            }

            return res.status(201).json({
                success: true,
                message: "Item created successfully",
                data: {
                    ...savedItem,
                    secret_answer: undefined,
                    images
                }
            });

        } catch (err) {
            next(err);
        }
    }
    async reportItem(req, res, next) {
        try {
            const itemId = Number(req.params.id)
            const item = await itemRepo.findOne({ where: { id: itemId } })

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Data not found"
                })
            }

            if (item.type.toLowerCase().trim() == 'found') {
                return res.status(409).json({
                    success: false,
                    message: "Faqat yo'qotilgan e'lonlarga report bera olasiz"
                })
            }
            const { message } = req.body
            const owner = await userRepo.findOne({ where: { id: item.user_id } })
            const reporter = await userRepo.findOne({ where: { id: Number(req.user.id) } })

            await messageEmail(owner.email, "Report Item", owner.full_name, `Xabar yuboruvchining ismi: ${reporter.full_name}, telefon raqami: ${reporter.phone} Yuborilgan Xabar: ${message}`)

            return res.json({
                success: true,
                message: "Xabar e'lon egasiga jo'natildi"
            })

        } catch (err) {
            next(err)
        }
    }
    async updateItem(req, res, next) {
        try {
            const id = Number(req.params.id)
            const userId = Number(req.user.id)
            const { title, description, location, category_id, status } = req.body
            const item = await itemRepo.findOne({ where: { id } })

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item topilmadi"
                })
            }

            if (item.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Bu e'lonni tahrirlashga ruxsatingiz yo'q"
                })
            }

            if (item.status === "returned") {
                return res.status(400).json({
                    success: false,
                    message: "Qaytarilgan e'lonni tahrirlab bo'lmaydi"
                })
            }

             if (category_id !== undefined) {
            const categoryId = Number(category_id);

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "category_id noto'g'ri"
                });
            }

            const category = await catRepo.findOne({
                where: { id: categoryId }
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category topilmadi"
                });
            }

            item.category_id = categoryId;
        }


            if (status !== undefined) {
            if (status !== "closed") {
                return res.status(400).json({
                    success: false,
                    message: "Status faqat 'closed' ga o'zgartirilishi mumkin"
                })
            }

            item.status = "closed"
        }

         if (title !== undefined) {
            item.title = title;
        }

        if (description !== undefined) {
            item.description = description;
        }

        if (location !== undefined) {
            item.location = location;
        }

        const updatedItem = await itemRepo.save(item);
          return res.status(200).json({
            success: true,
            message: "Item muvaffaqiyatli yangilandi",
            data: updatedItem
        })

        } catch (err) {
            next(err)
        }
    }
    async delItem(req, res, next) {
    try {
        const id = Number(req.params.id);
        const userId = Number(req.user.id);
        const role = req.user.role;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Item id noto'g'ri"
            });
        }

        const item = await itemRepo.findOne({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item topilmadi"
            });
        }

        if (item.user_id !== userId && role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Bu e'lonni o'chirishga ruxsatingiz yo'q"
            });
        }

        const images = await itemImageRepo.find({
            where: {
                item_id: id
            }
        });

        for (const image of images) {
            const filePath = path.join(
                process.cwd(),
                "uploads",
                "items",
                image.filename
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await itemRepo.remove(item);

        return res.status(200).json({
            success: true,
            message: "E'lon va uning rasmlari muvaffaqiyatli o'chirildi"
        })

    } catch (err) {
        next(err);
    }
}
}

export default new ItemController