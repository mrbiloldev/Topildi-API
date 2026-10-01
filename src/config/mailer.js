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

export const messageEmail=async (toEmail,subject, full_name,message)=>{
    transporter.sendMail({
        from: "Topildi Service",
        to: toEmail,
        subject: subject,
        html: `<h1>Salom ${full_name.toUpperCase()}</h1> \n
         <h1>${message}</h1>`
    })
}
