import { createClient } from "redis"
import { config } from "dotenv"

config()

export const redis=createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
})

redis.on('error', (err)=>{
    console.log("Error is on redis connection",err);
})

await redis.connect()