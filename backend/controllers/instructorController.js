const Instructor = require("../models/instructorModel");

// GET /instructors — fetch all instructors
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch instructors", error: error.message });
  }
};

// POST /instructors — add a new instructor
const createInstructor = async (req, res) => {
  try {
    const { name, specialization } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ message: "Name and specialization are required." });
    }

    const newInstructor = new Instructor({ name, specialization });
    const savedInstructor = await newInstructor.save();

    res.status(201).json(savedInstructor);
  } catch (error) {
    res.status(500).json({ message: "Failed to create instructor", error: error.message });
  }
};

const editInstructor = async(req,res)=>{
  try{
    const changes = req.body;
    const {id} = req.params;
    const instructor = await Instructor.findByIdAndUpdate(id,changes,{
      new:true,
      runValidators:true
    });

    if(!instructor){
      res.status(404).json({"message":"Instructor not found"});
    }
    res.status(200).json({"message":"instructor updated successfully"})
  }catch(error){
    res.status(500).json({ message: "Failed to update course", error: error.message });
  }
}

// DELETE /instructors/:id
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Instructor.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete instructor", error: error.message });
  }
};

module.exports = { getAllInstructors, createInstructor, editInstructor, deleteInstructor };