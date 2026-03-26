import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/courses"; // adjust to your backend URL

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // null = add mode, object = edit mode
  const [formData, setFormData] = useState({
    courseName: "",
    instructor: "",
    specialization: "",
    duration: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ─── Fetch all courses ────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_BASE);
      setCourses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ─── Open modal ───────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({ courseName: "", instructor: "", specialization: "", duration: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      instructor: course.instructor,
      specialization: course.specialization || "",
      duration: course.duration,
      description: course.description || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  // ─── Handle form input ────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Submit (create or update) ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCourse) {
        // UPDATE
        const res = await axios.put(`${API_BASE}/${editingCourse._id}`, formData);
        setCourses((prev) =>
          prev.map((c) => (c._id === editingCourse._id ? res.data : c))
        );
      } else {
        // CREATE
        const res = await axios.post(API_BASE, formData);
        setCourses((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course.");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 p-6 min-h-screen overflow-hidden">
      <div className="mt-2">
        <h1 className="text-3xl font-serif font-bold">COURSES</h1>
        <p className="text-sm font-medium opacity-50">{courses.length} COURSES TOTAL</p>
      </div>

      <div className="w-full h-full bg-white mt-5 p-6 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.2)]">
        {/* Heading + Add button */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-semibold text-lg px-2 py-2 font-serif">ALL COURSES</h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-2xl hover:bg-blue-700 transition"
          >
            + Add Course
          </button>
        </div>

        {/* Loading / Error states */}
        {loading && <p className="text-center py-10 text-gray-400">Loading courses...</p>}
        {error && <p className="text-center py-10 text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Column headers */}
            <div className="flex p-4 bg-gray-50 mt-2">
              <p className="w-1/12 text-xs font-bold opacity-30">#</p>
              <p className="w-1/4 text-xs font-bold opacity-30">COURSE NAME</p>
              <p className="w-1/5 text-xs font-bold opacity-30">INSTRUCTOR</p>
              <p className="w-1/6 text-xs font-bold opacity-30">DURATION</p>
              <p className="w-1/4 text-xs font-bold opacity-30">DESCRIPTION</p>
              <p className="w-1/3 text-xs font-bold opacity-30 text-right">ACTIONS</p>
            </div>

            {/* Rows */}
            {courses.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No courses found. Add one!</p>
            ) : (
              courses.map((course, index) => (
                <div key={course._id} className="flex p-4   items-center">
                  <p className="w-1/12 text-sm font-bold opacity-30">{index + 1}</p>

                  <p className="w-1/4 text-sm font-bold">{course.courseName}</p>

                  <p className="w-1/5 text-sm">
                    {course.instructor}
                    <span className="block text-xs opacity-40">{course.specialization}</span>
                  </p>

                  <p className="w-1/6 font-medium text-sm">
                    <span className="bg-blue-200 text-blue-600 px-3 py-1 rounded-2xl">
                      {course.duration}
                    </span>
                  </p>

                  <p className="w-1/4 text-sm">{course.description}</p>

                  <div className="flex justify-end gap-2 w-1/3">
                    <button
                      onClick={() => openEditModal(course)}
                      className="px-3 py-1 text-blue-600 border rounded-2xl text-sm hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="px-3 py-1 text-red-600 border rounded-2xl text-sm hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* ─── Add / Edit Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-serif font-bold mb-6">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="Course Name *"
                required
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Instructor *"
                required
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Specialization"
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration * (e.g. 6 weeks)"
                required
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-2xl text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCourse ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;