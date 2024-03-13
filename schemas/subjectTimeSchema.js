import mongoose from "mongoose";

const subjectTimeSchema = mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId, ref:"student"},
    subject:{type:mongoose.Schema.Types.ObjectId, ref:"subject"},
    time:{type:Number,default:0} //storing time in mins
})

const SubjectTime = mongoose.model("subject-time",subjectTimeSchema);

export default SubjectTime;