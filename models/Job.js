const mongoose=require('mongoose')
const User=require('../models/User')

const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide a Company'],
        maxlength:40
    },
    position:{
        type:String,
        required:[true,'Please provide a company name'],
        maxlength:40,
    },
    status:{
        type:String,
        enum:['interview','pending','declined','accepted'],
        default:'pending'
    },
    createdBy:{

        // this links the job model with user
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide a user']
    }
},{timestamps:true})

module.exports=mongoose.model('Job-API',jobSchema);