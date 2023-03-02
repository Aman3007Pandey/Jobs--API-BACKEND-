const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors');

const auth=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Invalid Authentication');
    }

    const token=authHeader.split(' ')[1];
    try {
        const payload=jwt.verify(token,'jwt-secret');
        req.user={userId:payload.userId,name:payload.name};
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports=auth;