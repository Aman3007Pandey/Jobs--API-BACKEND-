const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
})

// Instace methods
userSchema.methods.createJWT=function(){
  const token=jwt.sign({userId:this._id,name:this.name},'jwt-secret',{expiresIn:'30d'});
  return token;
}
userSchema.methods.getName=function(){
  return this.name;
}


userSchema.methods.comparePassword=async function(candidatePassword){

  const isMatch=await bcrypt.compare(candidatePassword,this.password);
  return isMatch;
}
// before saving authenticate
userSchema.pre('save',async function(next){
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
  next();
})

module.exports=mongoose.model('User-Jobs-Api',userSchema);