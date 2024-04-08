import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
    test:{type:mongoose.Schema.Types.ObjectId, ref:"test"},
    question:{type:String,required:true},
    optionA:{type:String},
    optionB:{type:String},
    optionC:{type:String},
    optionD:{type:String},
    optionE:{type:String},
    optionF:{type:String},
    pageRef:{type:Number,default:1},
    hint:{type:String},
    answer:{type:String,required:true}, // [A,B,C,D],
    marks:{type:Number,default:1}
})

const Questions = mongoose.model("questions",questionSchema);

export default Questions;