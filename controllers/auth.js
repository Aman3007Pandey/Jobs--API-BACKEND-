const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
const jwt=require('jsonwebtoken')
const {BadRequestError,UnauthenticatedError}=require('../errors')
const register=async(req,res)=>{
    //const user=await User.create({...req.body});
    // if we use the above way it directly uploads password as string
   
    // const {name,email,password}=req.body;

    // const salt=await bcryptjs.genSalt(10);// number of random bytes
    // const hashedPassword=await bcryptjs.hash(password,salt); // now hash

    // const tempUser={name,email,password:hashedPassword};

    // to avoid to many logic in our register controller password hashing is done in mongoose.model

    const user=await User.create({...req.body});// this also calls middleware

    // now sign the token and send response with it
    // data,secret,expirein
    // const token=jwt.sign({userId:user._id,name:user.name},'jwt-secret',{expiresIn:'30d'})

    // now we will create JWT using instance method of user.

    const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token});
}

const login=async(req,res)=>{

    const{email,password}=req.body;

    if(!email || !password)
    {
        throw new BadRequestError('please provide email and password');
    }
    
    const user=await User.findOne({email});

    if(!user)
    {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    

    const isPasswordCorrect=await user.comparePassword(password);
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    
    const token=user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}

module.exports={register,login};