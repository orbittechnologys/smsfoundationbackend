import mongoose from "mongoose";


const instructorSchema = mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {type:String},
    lastName:String,
    middleName:String,
    qualification:String,
    phone:{type:String,unique:true, required:true},
    school: [{ type: mongoose.Schema.Types.ObjectId, ref: "school" }], // 1 Instructor has multiple schools
    medium:String,
    gender:String,
    user:{type:mongoose.Schema.Types.ObjectId, ref:"users"}
  });


const Instructor = mongoose.model("instructor",instructorSchema);

export default Instructor;
