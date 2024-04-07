import Medium from "../schemas/mediumSchema.js";
import asyncHandler from "express-async-handler";

export const addMedium = asyncHandler(async (req,res) => {
    try {
        const {name,reference} = req.body;

        const medDoc = await Medium.findOne({name:name});
        if(medDoc){
            console.log("Already medium exists ",medDoc);
            return res.status(400).json({success:false,msg:"Medium Already Exists",medDoc})
        }

        const medium = await Medium.create({
            name,
            reference
          });

        console.log("Medium created successfully:"+name);

        return res.status(200).json({success:true,medium});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllMedium = asyncHandler(async (req,res) => {
    try {
        const mediums = await Medium.find({});
        return res.status(200).json({success:true,mediums});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})