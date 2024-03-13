import mongoose from "mongoose";


const chapterSchema = mongoose.Schema({
    chapterUrl:{type:String,required:true,unique:true},
    name:{type:String},
    desc:{type:String},
    subject:{type:mongoose.Schema.Types.ObjectId, ref:"subject"},
    totalHours:{type:Number,default:0}
  });


  const Chapter = mongoose.model("chapter",chapterSchema);

  export default Chapter;