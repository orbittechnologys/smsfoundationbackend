import mongoose from "mongoose";

const schoolSchema = mongoose.Schema({
    name:{type:String},
    principalName:{type:String},
    address:{type:String},
    district:{type:String},
    pincode:{type:String},
    syllabus:{type:String},
    medium:{type:String},
    internet:{type:Boolean},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

schoolSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const School = mongoose.model("school",schoolSchema);

export default School;