const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// GET /courses
router.get("/", getAllCourses);

// POST /courses
router.post("/", createCourse);

// PUT /courses/:id
router.put("/:id", updateCourse);

// DELETE /courses/:id
router.delete("/:id", deleteCourse);

module.exports = router;