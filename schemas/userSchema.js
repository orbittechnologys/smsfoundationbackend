import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const reqString = {
  type: String,
  required: true,
};

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username:reqString,
  loginUser:{type:String,unique:true},
  password: reqString,
  phone : {type:String, unique:true},
  role:{
    type: String,
    enum: ["ADMIN", "STUDENT", "INSTRUCTOR"],
    default: "STUDENT",
  },
});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt) ;
})

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword , this.password);
}

const User = mongoose.model("users", userSchema); 

export default User;