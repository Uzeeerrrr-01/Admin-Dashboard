const Course = require("../models/courseModel");

// GET /courses — fetch all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// POST /courses — add a new course
const createCourse = async (req, res) => {
  try {
    const { courseName, instructor, specialization, duration, description } = req.body;

    // Basic validation
    if (!courseName || !instructor || !duration) {
      return res.status(400).json({ message: "courseName, instructor, and duration are required." });
    }

    const newCourse = new Course({ courseName, instructor, specialization, duration, description });
    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course", error: error.message });
  }
};

// PUT /courses/:id — update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,          // return the updated document
      runValidators: true // run schema validators on update
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error: error.message });
  }
};

// DELETE /courses/:id — delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
};

module.exports = { getAllCourses, createCourse, updateCourse, deleteCourse };