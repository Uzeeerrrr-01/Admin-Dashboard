const express = require("express");
const router = express.Router();
const {
  getAllInstructors,
  createInstructor,
  deleteInstructor,
  editInstructor
} = require("../controllers/instructorController");

// GET /instructors
router.get("/", getAllInstructors);

// POST /instructors
router.post("/", createInstructor);

router.put("/:id",editInstructor);

// DELETE /instructors/:id
router.delete("/:id", deleteInstructor);

module.exports = router;