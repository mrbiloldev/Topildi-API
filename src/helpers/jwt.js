import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()


const ACCESS_SECRET=process.env.JWT_ACCESS_SECRET || "access_secret_key"
const REFRESH_SECRET=process.env.JWT_REFRESH_SECRET || "refresh_secret_key"

const ACCESS_EXPIRET_IN=process.env.JWT_ACCESS_EXPIRES_IN || "15m"
const REFRESH_EXPIRET_IN=process.env.JWT_REFRESH_EXPIRES_IN || "7d"


function generateAccessToken(payload){
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn : ACCESS_EXPIRET_IN})
}

function generateRefreshToken(payload){
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn : REFRESH_EXPIRET_IN})
}

function verifyAccessToken(token){
    return jwt.verify(token,ACCESS_SECRET)
}

function verifyRefreshToken(token){
    return jwt.verify(token,REFRESH_SECRET)
}


export{
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}