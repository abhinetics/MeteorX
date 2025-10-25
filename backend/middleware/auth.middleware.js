import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.services.js';

export const authUser = async (req,res,next) =>{
    try {
    // const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];


    if(!token){
        return res.status(401).send({error:"Unauthorized User"});
    }

    const isBlacklisted = await redisClient.get(token);
    if(isBlacklisted){
        res.cookies.token = "";
        return res.status(401).send({error:"Unauthorized User"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
}
catch (err){
    console.log(err)
    res.status(401).send({error:"Unauthorized User"});
}

}
