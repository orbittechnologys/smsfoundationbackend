import mongoose from "mongoose";

const chapterSchema = mongoose.Schema({
  chapterUrl: { type: String },
  audioUrl: { type: String },
  videoUrl: [{ type: String }],
  name: { type: String },
  desc: { type: String },
  subtitle: {type: String},
  thumbnail: { type: String },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "subject" },
  totalHours: { type: Number, default: 0 },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "test" },
});

const Chapter = mongoose.model("chapter", chapterSchema);

export default Chapter;
