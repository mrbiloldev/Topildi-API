import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { config } from 'dotenv'


config()

export function sha256(text) {
    return crypto.createHash('sha256').update(text).digest('hex')
}

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10

export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword)
}