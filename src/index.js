import express from 'express'
import { config } from 'dotenv'
import { AppData } from './config/data-source.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/error.middleware.js'
import categoryRoutes from './routes/category.routes.js'
import claimRoutes from './routes/claim.routes.js'
import itemRoutes from './routes/items.routes.js'


config()

const port=Number(process.env.PORT)||3000
const app=express()


app.use(express.json())
app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', claimRoutes)
app.use('/api', itemRoutes)
app.use('/uploads', express.static("uploads"))

app.use(errorHandler)

AppData.initialize()
    .then(()=>{
        console.log('Database connected');
        
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((err)=>{
        console.log("Error is on database connection", err);
    })



