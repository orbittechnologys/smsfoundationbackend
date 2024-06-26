import asyncHandler from "express-async-handler";
import Subject from "../schemas/subjectSchema.js";

export const addSubject = asyncHandler(async (req, res) => {
  try {
    const { standard, medium, syllabus, name } = req.body;

    const subjectDoc = await Subject.findOne({
      standard,
      medium,
      syllabus,
      name,
    });

    if (subjectDoc) {
      console.log("Subject already exists");
      return res
        .status(400)
        .json({ success: false, msg: "Subject already exists" });
    }

    const subject = await Subject.create({
      standard,
      medium,
      syllabus,
      name,
    });

    return res.status(200).json({ success: true, subject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ sucess: false, error });
  }
});

export const getAllSubjects = asyncHandler(async (req, res) => {
  try {
    const subjects = await Subject.find({}).exec();

    return res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const getSubjects = asyncHandler(async (req, res) => {
  const { standard, syllabus, medium } = req.body;

  try {
    const subjects = await Subject.find({ standard, syllabus, medium }).exec();

    return res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const getSubjectById = asyncHandler(async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc) {
      return res
        .status(400)
        .json({ success: false, msg: "No such subject ID" });
    }
    return res.status(200).json({ success: true, subjectDoc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const editSubject = asyncHandler(async (req, res) => {
  try {
    const { standard, medium, syllabus, name, id } = req.body;
    const subjectDoc = await Subject.findById(id);
    if (!subjectDoc) {
      return res
        .status(404)
        .json({ success: false, msg: `No such subject ID -> ${id}` });
    }

    subjectDoc.standard = standard;
    subjectDoc.medium = medium;
    subjectDoc.syllabus = syllabus;
    subjectDoc.name = name;
    await subjectDoc.save();

    return res.status(200).json({
      success: true,
      subjectDoc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

export const deleteSubject = asyncHandler(async (req, res) => {
  try {
    const subjectId = req.params.id;
    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc) {
      return res.status(404).json({
        success: false,
        msg: `Subject Id Not Found ${subjectId}`,
      });
    }
    await subjectDoc.deleteOne();
    return res.status(200).json({
      success: true,
      msg: `Subject Deleted Successfully By Id -> ${subjectId}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
});
