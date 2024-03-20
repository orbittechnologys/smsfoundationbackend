import mongoose from "mongoose";

const chapterTimeSchema = mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId, ref:"student"},
    chapter:{type:mongoose.Schema.Types.ObjectId, ref:"chapter"},
    time:{type:Number,default:0}, //storing time in mins,
    status:{type:String, default:"ONGOING"}
  });

const ChapterTime = mongoose.model("chapter-time",chapterTimeSchema);

export default ChapterTime;