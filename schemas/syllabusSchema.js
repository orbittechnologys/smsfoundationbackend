import mongoose from "mongoose";


const syllabusSchema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    reference: {type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

syllabusSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Syllabus = mongoose.model("syllabus",syllabusSchema);

export default Syllabus;