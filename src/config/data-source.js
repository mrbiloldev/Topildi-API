import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { User } from '../entities/user.entity.js'
import { Item } from '../entities/items.entity.js'
import { Category } from '../entities/category.entity.js'
import { ItemImage } from '../entities/item-images.entity.js'
import { Claim } from '../entities/claims.entity.js'

config()

export const AppData=new DataSource({
    type: 'postgres',

    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),

    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Item, Category, ItemImage, Claim],

    synchronize: true,

    logging: false
})