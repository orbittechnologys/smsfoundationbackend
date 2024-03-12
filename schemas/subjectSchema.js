import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
    name:{type:String, required:true},
    standard:{type:Number, required:true},
    syllabus:{type:String, required:true},
    medium:{type:String,required:true},
    noOfChapter:{type:String,default:0}
  });


const Subject = mongoose.model("subject",subjectSchema);

export default Subject;