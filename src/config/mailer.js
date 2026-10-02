import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config()

const transporter=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_USER_PASS
    }
})

export const messageEmail = async (toEmail, subject, full_name, message) => {
    try {
        await transporter.sendMail({
            from: `"Topildi Service" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            html: `
                <h1>Salom ${full_name}</h1>
                <p>${message}</p>
            `
        })

        return true
    } catch (err) {
        console.log("Email yuborishda xato:", err)
        return false
    }
}