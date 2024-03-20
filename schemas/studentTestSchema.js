import mongoose from "mongoose";

const studentTestSchema = mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId, ref:"student"},
    test:{type:mongoose.Schema.Types.ObjectId, ref:"test"},
    marks:{type:Number,default:0} 
})

const studentTest = mongoose.model("studentTest",studentTestSchema);

export default studentTest;

