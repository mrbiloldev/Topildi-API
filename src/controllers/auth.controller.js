import { AppData } from "../config/data-source.js"
import { User } from "../entities/user.entity.js"
import { hashPassword } from "../helpers/hash.js"
import { saveOtp, verifyOtp } from "../helpers/otp.js"

const userRepo = AppData.getRepository(User)

class AuthController {
    async register(req, res, next) {
        try {
            const { full_name, email, phone, password } = req.body

            const checkEmail = await userRepo.findOne({
                where: { email }
            })

            if (checkEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                })
            }

            const otp = await saveOtp(email)
            const hashedPass = await hashPassword(password)
            console.log(otp);
            

            const user = await userRepo.create({
                full_name, email, phone, password: hashedPass
            })

            const savedUser = await userRepo.save(user)

            return res.status(201).json({
                success: true,
                message: "User created",
                data: savedUser
            })

        } catch (err) {
            next(err)
        }
    }
    async verify(req, res, next) {
        try {
            const {email, code}=req.body
            const user=await userRepo.findOne({
                where: {email}
            })

            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            if(user.isVerified){
                return res.status(400).json({
                    success: false,
                    message: "Email already verified"
                })
            }

            const result = await verifyOtp(email, code)

            if(!result.success){
                return res.status(400).json({
                    success: false,
                    message: result.message
                })
            }

            await userRepo.update(
                {email},
                {isVerified: true}
            )
            
            return res.json({
                success: true,
                message: "Email is verified successfully"
            })


        } catch (err) {
            next(err)
        }
    }
    async resendOtp(req, res, next) {
        try {
            const {email}=req.body
            const user=await userRepo.findOne({
                where:{email}
            })

            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "Useer not found"
                })
            }

            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: "Email already verified "
                })
            }
            
             const result = await saveOtp(email);

            if (!result.success) {
                return res.status(429).json({
                    success: false,
                    message: result.message
                });
            }

            console.log(result.otp);
            

            return res.json({
                success: true,
                message: "Otp kod qayta yuborildi"
            })


        } catch (err) {
            next(err)
        }
    }
    async login(req, res, next) {
        try {
            
        } catch (err) {
            next(err)
        }
    }
    async forgotPass(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }
    async resetPass(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }
    async me(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }
}

export default new AuthController