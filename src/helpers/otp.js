import crypto from "crypto"
import { redis } from "../config/redis.js"

const OTP_LENGTH=6
const OTP_TTL_S=120
const OTP_RESEND_S=60

const otpKey=(email)=>`otp: ${email}`

export function generateOtp(){
    return crypto.randomInt(0,10**OTP_LENGTH).toString().padStart(OTP_LENGTH, '0')
}

export async function saveOtp(email) {
    const existing=await redis.get(otpKey(email));

    if(existing){
        const record=JSON.parse(existing);

        const timePassed=(Date.now()-record.lastOtp)/1000

        if(timePassed<OTP_RESEND_S){
            const remaining=Math.ceil(OTP_RESEND_S-timePassed)

            return{
                success: false,
                message: `OTP ni ${remaining} soniyadan keyin qayta jo'natishingiz mumkin`
            }
        }
    }

    const otp=generateOtp()

    const data={
        otp,
        lastOtp: Date.now()
    }

    await redis.set(
        otpKey(email),
        JSON.stringify(data),
        {EX: OTP_TTL_S}
    )

    return {
        success: true,
        otp
    }

}

export async function verifyOtp(email, otp) {
    const existing=await redis.get(otpKey(email))

    if(!existing){
        return {
            success: false,
            message: "OTP topilmadi"
        }
    }

    const record=JSON.parse(existing)

    if(record.otp!== String(otp).padStart(OTP_LENGTH, "0")){
        return {
            success: false,
            message: "OTP noto'g'ri"
        }
    }

    await redis.del(otpKey(email))

    return {
        success: true,
        message: "OTP tasdiqlandi"
    }
}