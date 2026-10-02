import { verifyAccessToken } from "../helpers/jwt.js";

export const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            message:"Token not found"
        })
    }

    const token=authHeader.split(" ")[1]

    try{
        const decode=verifyAccessToken(token)
        req.user=decode
        next()
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Token invalid or expired"
        })
    }

}