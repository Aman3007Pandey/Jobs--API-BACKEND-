const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors');
const { findOne } = require('../models/Job');

const getAllJobs=async(req,res)=>{
    const jobs=await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}

const getJob=async(req,res)=>{
    const {user:{userId},params:{id:jobId}}=req; // req.user and req.params de-structuring

    const job=await Job.findOne({createdBy:userId,_id:jobId});

    if(!job)
    {
        throw new NotFoundError(`No job with this JobId ${jobId}`);
    }

    res.status(StatusCodes.OK).json({job});
}
const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId;
    const job=await Job.create(req.body);
    res.status(StatusCodes.OK).json(job);
}
const updateJob=async(req,res)=>{
    
    // first de-structure everything from req.

    const {
        body:{company,position},
        params:{id:jobId},
        user:{userId}
    }=req;

    if(company==='' || position==='')
    {
        throw new NotFoundError('One or more key fields is empty');
    }
    
    // condition for find then what u want to update
    const job=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});
    
    console.log('aman');
    if(!job)
    {
      throw new NotFoundError(`No job with JobId ${jobId}`);
    }

    res.status(StatusCodes.OK).json({job});
}
const deleteJob=async(req,res)=>{
    const{
    user:{userId},
    params:{id:jobId}
    }=req;

    const job=await Job.findByIdAndRemove({createdBy:userId,_id:jobId});
     if(!job)
    {
      throw new NotFoundError(`No job with JobId ${jobId}`);
    }

    res.status(200).json({message:'Succesfully Deleted'});
}

module.exports={getAllJobs,getJob,createJob,deleteJob,updateJob};

