import mongoose from "mongoose";
import Questions from "./questionsSchema.js";

const studentTestSchema = mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId, ref:"student"},
    test:{type:mongoose.Schema.Types.ObjectId, ref:"test"},
    marks:{type:Number,default:0},
    selectedAnswers: [
        {
            Questions: { type: mongoose.Schema.Types.ObjectId, ref: "question" },
            selectedAnswerByUser: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } 
})

studentTestSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const studentTest = mongoose.model("studentTest",studentTestSchema);

export default studentTest;

