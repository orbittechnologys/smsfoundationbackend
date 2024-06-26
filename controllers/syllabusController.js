import Syllabus from "../schemas/syllabusSchema.js";
import asyncHandler from "express-async-handler";

export const addSyllabus = asyncHandler(async (req, res) => {
  try {
    const { name, reference } = req.body;

    const syllabusDoc = await Syllabus.findOne({ name: name });

    if (syllabusDoc) {
      console.log("Syllabus already exists", syllabusDoc);
      return res
        .status(400)
        .json({ success: false, msg: "Syllabus already exists", syllabusDoc });
    }

    const syllabus = await Syllabus.create({
      name,
      reference,
    });

    console.log("Syllabus created ", syllabus);
    return res.status(200).json({ success: true, syllabus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const getAllSyllabus = asyncHandler(async (req, res) => {
  try {
    const syllabus = await Syllabus.find({});
    return res.status(200).json({ success: true, syllabus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const editSyllabus = asyncHandler(async (req, res) => {
  try {
    const { name, reference, id } = req.body;

    const syllabusDoc = await Syllabus.findById(id);
    if (!syllabusDoc) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Syllabus " + name,
      });
    }
    syllabusDoc.name = name.toUpperCase();
    syllabusDoc.reference = reference;

    await syllabusDoc.save();

    return res.status(200).json({
      success: true,
      syllabusDoc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

export const deleteSyllabus = asyncHandler(async (req, res) => {
  try {
    const syllabusId = req.params.id;

    const syllabusDoc = await Syllabus.findById(syllabusId);
    if (!syllabusDoc) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Syllabus " + syllabusId,
      });
    }

    await syllabusDoc.deleteOne();

    return res.status(200).json({
      success: true,
      msg: "Deleted successfully " + syllabusId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});
