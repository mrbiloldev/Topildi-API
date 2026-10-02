import { AppData } from "../config/data-source.js"
import { messageEmail } from "../config/mailer.js"
import { Claim } from "../entities/claims.entity.js"
import { Item } from "../entities/items.entity.js"
import { User } from "../entities/user.entity.js"
import { comparePassword } from "../helpers/hash.js"

const claimRepo = AppData.getRepository(Claim)
const itemRepo = AppData.getRepository(Item)
const userRepo = AppData.getRepository(User)

class ClaimsController {
   async getMyClaims(req, res, next) {
      try {
         const userId = Number(req.user.id)

         const claims = await claimRepo.find({
            where: {
               claimant_id: userId
            },
            relations: {
               item: true
            },
            order: {
               id: "DESC"
            }
         })

         return res.status(200).json({
            success: true,
            data: claims
         })


      } catch (err) {
         next(err)
      }
   }
   async createClaim(req, res, next) {
      try {
         const itemId = Number(req.params.id)
         const userId = Number(req.user.id)
         const { answer, message } = req.body

         if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
               success: false,
               message: "Item id noto'g'ri"
            })
         }

         if (!answer) {
            return res.status(400).json({
               success: false,
               message: "Javob kiritilishi kerak"
            })
         }

         const item = await itemRepo.findOne({where: {id: itemId}})

         if (!item) {
            return res.status(404).json({
               success: false,
               message: "Item topilmadi"
            })
         }

         if (item.type !== "found") {
            return res.status(400).json({
               success: false,
               message: "Faqat topilgan buyumga da'vo yuborish mumkin"
            })
         }

         if (item.status !== "active") {
            return res.status(400).json({
               success: false,
               message: "Bu e'lon faol emas"
            })
         }

         if (item.user_id === userId) {
            return res.status(403).json({
               success: false,
               message: "O'z e'loningizga da'vo yubora olmaysiz"
            })
         }

         const pendingClaim = await claimRepo.findOne({
            where: {
               item_id: itemId,
               claimant_id: userId,
               status: "pending"
            }
         })

         if (pendingClaim) {
            return res.status(409).json({
               success: false,
               message: "Bu e'longa pending da'vongiz mavjud"
            })
         }

         const wrongAttempts = await claimRepo.count({
            where: {
               item_id: itemId,
               claimant_id: userId,
               status: "rejected"
            }
         })

         if (wrongAttempts >= 3) {
            return res.status(429).json({
               success: false,
               message: "Urinishlar soni tugadi"
            })
         }

         const normalizedAnswer = answer.trim().toLowerCase()

         const isCorrect = await comparePassword(normalizedAnswer,item.secret_answer)

         if (!isCorrect) {

            await claimRepo.save({
               item_id: itemId,
               claimant_id: userId,
               message,
               status: "rejected"
            });

            return res.status(400).json({
               success: false,
               message: "Javob noto'g'ri"
            });
         }

         const claim = claimRepo.create({
            item_id: itemId,
            claimant_id: userId,
            message,
            status: "pending"
         });

         const savedClaim = await claimRepo.save(claim);

         const owner = await userRepo.findOne({
            where: {
               id: item.user_id
            }
         });

         const claimant = await userRepo.findOne({ where: { id: userId } })

         try {
            if (owner) {
               await messageEmail(
                  owner.email,
                  "Yangi da'vo",
                  owner.full_name,
                  `"${item.title}" e'loningizga ${claimant?.full_name} tomonidan da'vo keldi. Xabar: ${message || "Xabar yo'q"}`
               )
            }
         } catch (err) {
            console.log("Email yuborishda xato:", err);
         }

         return res.status(201).json({
            success: true,
            message: "Da'vo yuborildi",
            data: savedClaim
         })
      } catch (err) {
         next(err)
      }
   }
   async getAllClaims(req, res, next) {
      try {
          const itemId = Number(req.params.id);
            const userId = Number(req.user.id);

            if (!Number.isInteger(itemId) || itemId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Item id noto'g'ri"
                })
            }

            const item = await itemRepo.findOne({
                where: {
                    id: itemId
                }
            })

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item topilmadi"
                })
            }

            if (item.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Bu e'lon da'volarini ko'rishga ruxsatingiz yo'q"
                })
            }

            const claims = await claimRepo.find({
                where: {
                    item_id: itemId
                },
                relations: {
                    claimant: true
                },
                order: {
                    id: "DESC"
                }
            })

            const safeClaims = claims.map(claim => {
                if (claim.claimant) {
                    delete claim.claimant.password
                }
                return claim
            })

            return res.status(200).json({
                success: true,
                data: safeClaims
            })
      } catch (err) {
         next(err)
      }
   }
   async approveClaim(req, res, next) {
        try {
            const claimId = Number(req.params.id)
            const userId = Number(req.user.id)

            if (!Number.isInteger(claimId) || claimId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Claim id noto'g'ri"
                })
            }

            const claim = await claimRepo.findOne({
                where: {
                    id: claimId
                },
                relations: {
                    item: true,
                    claimant: true
                }
            })

            if (!claim) {
                return res.status(404).json({
                    success: false,
                    message: "Da'vo topilmadi"
                })
            }

            if (claim.item.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Bu da'voni tasdiqlashga ruxsatingiz yo'q"
                })
            }

            if (claim.status !== "pending") {
                return res.status(400).json({
                    success: false,
                    message: "Faqat pending da'voni tasdiqlash mumkin"
                })
            }

            await AppData.transaction(async manager => {

                const transactionClaimRepo =
                    manager.getRepository(Claim);

                const transactionItemRepo =
                    manager.getRepository(Item);

                // Shu claimni approved qilamiz
                await transactionClaimRepo.update(
                    {
                        id: claimId
                    },
                    {
                        status: "approved"
                    }
                )

                // Itemni returned qilamiz
                await transactionItemRepo.update(
                    {
                        id: claim.item_id
                    },
                    {
                        status: "returned"
                    }
                );

                // Boshqa pending claimlarni rejected qilamiz
                await transactionClaimRepo
                    .createQueryBuilder()
                    .update()
                    .set({
                        status: "rejected"
                    })
                    .where("item_id = :itemId", {
                        itemId: claim.item_id
                    })
                    .andWhere("status = :status", {
                        status: "pending"
                    })
                    .andWhere("id != :claimId", {
                        claimId
                    })
                    .execute();

            })

            // Item egasini olamiz
            const owner = await userRepo.findOne({
                where: {
                    id: claim.item.user_id
                }
            })

            const claimant = claim.claimant

            /*
                Ikkala tomonga email
            */
            try {

                if (owner && claimant) {

                    await messageEmail(
                        owner.email,
                        "Da'vo tasdiqlandi",
                        owner.full_name,
                        `Da'vogar: ${claimant.full_name}. Telefon: ${claimant.phone}`
                    )

                    await messageEmail(
                        claimant.email,
                        "Da'vo tasdiqlandi",
                        claimant.full_name,
                        `E'lon egasi: ${owner.full_name}. Telefon: ${owner.phone}`
                    )

                }

            } catch (mailErr) {
                console.log(
                    "Email yuborishda xato:",
                    mailErr
                )
            }

            return res.status(200).json({
                success: true,
                message: "Da'vo tasdiqlandi"
            })

        } catch (err) {
            next(err)
        }
    }

    async rejectClaim(req, res, next) {
        try {
            const claimId = Number(req.params.id)
            const userId = Number(req.user.id)

            if (!Number.isInteger(claimId) || claimId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Claim id noto'g'ri"
                })
            }

            const claim = await claimRepo.findOne({
                where: {
                    id: claimId
                },
                relations: {
                    item: true,
                    claimant: true
                }
            });

            if (!claim) {
                return res.status(404).json({
                    success: false,
                    message: "Da'vo topilmadi"
                });
            }

            // Faqat item egasi reject qila oladi
            if (claim.item.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Bu da'voni rad etishga ruxsatingiz yo'q"
                });
            }

            // Pending bo'lishi kerak
            if (claim.status !== "pending") {
                return res.status(400).json({
                    success: false,
                    message: "Faqat pending da'voni rad etish mumkin"
                });
            }

            claim.status = "rejected";

            await claimRepo.save(claim);

            // Claimantga email
            try {

                if (claim.claimant) {

                    await messageEmail(
                        claim.claimant.email,
                        "Da'vo rad etildi",
                        claim.claimant.full_name,
                        `"${claim.item.title}" e'loniga yuborgan da'vongiz rad etildi`
                    );

                }

            } catch (mailErr) {
                console.log(
                    "Email yuborishda xato:",
                    mailErr
                );
            }

            return res.status(200).json({
                success: true,
                message: "Da'vo rad etildi"
            });

        } catch (err) {
            next(err);
        }
    }
}

export default new ClaimsController