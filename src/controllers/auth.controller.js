import { AppData } from "../config/data-source.js"
import { messageEmail } from "../config/mailer.js"
import { User } from "../entities/user.entity.js"
import { comparePassword, hashPassword } from "../helpers/hash.js"
import { generateAccessToken } from "../helpers/jwt.js"
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
            
            const hashedPass = await hashPassword(password)
            const otp = await saveOtp(email)
            const isSent=await messageEmail(email, 'Email verification', full_name, `Sizning kodingiz: ${otp.otp}`)
            
             if (!isSent) {
                console.log(`OTP kod ${email} : ${otp.otp}`)
            }
            

            const user = await userRepo.create({
                full_name, email, phone, password: hashedPass
            })

            const savedUser = await userRepo.save(user)

            return res.status(201).json({
                success: true,
                message: "Emailingizga kod jo'natildi",
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

            const otp = await verifyOtp(email, code)

            if(!otp.success){
                return res.status(400).json({
                    success: false,
                    message: otp.message
                })
            }

            await userRepo.update(
                {email},
                {isVerified: true}
            )

            await messageEmail(email, 'Email Verification', user.full_name, 'Emailingiz muvaffaqiyatli tasdiqlandi')
            
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
            
             const otp = await saveOtp(email);

            if (!otp.success) {
                return res.status(429).json({
                    success: false,
                    message: otp.message
                });
            }

            const isSent=await messageEmail(email, 'Email verification', user.full_name, `Sizning kodingiz: ${otp.otp}`)
            
             if (!isSent) {
                console.log(`OTP kod ${email} : ${otp.otp}`)
            }
            

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
            const {email, password}=req.body
            const user=await userRepo.findOne({
                where:{email}
            })

            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "Email or password is incorrect"
                })
            }

            if(!user.isVerified){
                return res.status(403).json({
                    success: false,
                    message: "Email is not verified"
                })
            }

            const compare=await comparePassword(password,user.password)

            if(!compare){
                return res.status(400).json({
                    success: false,
                    message: "Email or password is incorrect"
                })
            }

            const payload={id: user.id, email: user.email}
            const accessToken=generateAccessToken(payload)
            const refreshToken=generateAccessToken(payload)

            return res.json({
                success: true,
                message: "Logged in successfully",
                accessToken,
                refreshToken
            })


        } catch (err) {
            next(err)
        }
    }
    async forgotPass(req, res, next) {
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

            const otp = await saveOtp(email)
            const isSent=await messageEmail(email, 'Reset password', user.full_name, `Sizning kodingiz: ${otp.otp}`)
            
             if (!isSent) {
                console.log(`OTP kod ${email} : ${otp.otp}`)
            }
                console.log(`OTP kod ${email} : ${otp.otp}`)


            return res.json({
                success: true,
                message: "Emailingizga kod yuborildi"
            })


        } catch (err) {
            next(err)
        }
    }
    async resetPass(req, res, next) {
        try {
            const {email, code, newPassword}=req.body
            const user=await userRepo.findOne({
                where:{email}
            })

            if(!user){
                 return res.status(404).json({
                    success: false,
                    message: "Useer not found"
                })
            }

            const otp = await verifyOtp(email, code)

            if(!otp.success){
                return res.status(400).json({
                    success: false,
                    message: otp.message
                })
            }

            const hashedPass=await hashPassword(newPassword)
            await userRepo.update(
                {email},
                {password: hashedPass}
            )

            return res.json({
                success: true,
                message: "Parol muvaffaqiyatli o'zgartirildi"
            })

        } catch (err) {
            next(err)
        }
    }
    async me(req, res, next) {
        try {
            const id=req.user.id
            const user=await userRepo.findOne({
                where:{id}
            })

            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            return res.json({
                success: true,
                data: user
            })

        } catch (err) {
            next(err)
        }
    }
}

export default new AuthController