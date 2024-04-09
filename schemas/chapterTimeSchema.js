import mongoose from "mongoose";

const chapterTimeSchema = mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId, ref:"student"},
    chapter:{type:mongoose.Schema.Types.ObjectId, ref:"chapter"},
    time:{type:Number,default:0}, //storing time in mins,
    page:{type:Number,default:0},
    status:{type:String, default:"ONGOING"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  chapterTimeSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ChapterTime = mongoose.model("chapter-time",chapterTimeSchema);

export default ChapterTime;