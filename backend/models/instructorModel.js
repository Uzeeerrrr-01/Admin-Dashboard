const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Instructor", instructorSchema);