import mongoose from "mongoose";

const testSchema = mongoose.Schema({
    name: {type:String, required:true},
    desc: {type:String},
    noOfQuestions:{type:Number, default:0},
    chapter:{type:mongoose.Schema.Types.ObjectId, ref:"chapter"},
    totalMarks:{type:Number,default:0}
})

const Test = mongoose.model("test",testSchema);

export default Test;