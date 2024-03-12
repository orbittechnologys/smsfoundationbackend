import mongoose from "mongoose";


const instructorSchema = mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {type:String},
    lastName:String,
    school:String,
    medium:String,
    user:{type:mongoose.Schema.Types.ObjectId, ref:"users"}
  });


const Instructor = mongoose.model("instructor",instructorSchema);

export default Instructor;
