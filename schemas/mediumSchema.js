import mongoose from "mongoose";

const mediumSchema = mongoose.Schema({
    name: {type:String, required:true, unique:true},
    reference: {type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

mediumSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Medium = mongoose.model("medium",mediumSchema);

export default Medium;