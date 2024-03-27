import mongoose from "mongoose";

const subjectCompletionSchema = mongoose.Schema({
    subject:{type:mongoose.Schema.Types.ObjectId, ref:"subject"},
    percentage:{type:Number}
})

const studentSchema = mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    rollNo:{type:String},
    standard:{type:Number},
    syllabus : {type:String},
    medium: {type:String},
    subjectCompletion:[subjectCompletionSchema],
    school:{type:mongoose.Schema.Types.ObjectId, ref:"school"},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"users"}
  });


const Student = mongoose.model("student",studentSchema);

export default Student;