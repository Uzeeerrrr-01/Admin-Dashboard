import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/instructors"; // 🔁 Change to your backend URL

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Add Instructor Modal State ----------
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", specialization: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // ---------- Edit Modal State ----------
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", specialization: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // ─── Fetch all instructors ───────────────────────────────────────────────
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // ─── Create instructor ───────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.name.trim() || !form.specialization.trim()) {
      setFormError("Name and specialization are required.");
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, specialization: form.specialization }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create instructor");
      }
      setShowModal(false);
      setForm({ name: "", specialization: "" });
      fetchInstructors();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Open edit modal ─────────────────────────────────────────────────────
  const openEdit = (instructor) => {
    setEditForm({
      id: instructor._id,
      name: instructor.name,
      specialization: instructor.specialization,
    });
    setEditError(null);
    setEditModal(true);
  };

  // ─── Update instructor (PUT /instructors/:id) ────────────────────────────
  // NOTE: Add a PUT route in your backend controller if not yet present (see below).
  const handleEdit = async () => {
    if (!editForm.name.trim() || !editForm.specialization.trim()) {
      setEditError("Name and specialization are required.");
      return;
    }
    try {
      setEditSubmitting(true);
      setEditError(null);
      const res = await fetch(`${API_BASE}/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editForm.name, specialization: editForm.specialization }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update instructor");
      }
      setEditModal(false);
      fetchInstructors();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  // ─── Delete instructor ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this instructor?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete instructor");
      fetchInstructors();
    } catch (err) {
      alert(err.message);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 p-6 min-h-screen overflow-hidden">

      {/* Top Section */}
      <div className="mt-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold">INSTRUCTORS</h1>
          <p className="text-sm font-medium opacity-50">
            {loading ? "Loading..." : `${instructors.length} Instructor${instructors.length !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormError(null); setForm({ name: "", specialization: "" }); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm hover:bg-blue-700"
        >
          + Add Instructor
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full bg-white mt-5 p-6 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.2)]">

        <div className="flex justify-between">
          <h1 className="font-semibold text-lg px-2 py-2 font-serif">ALL INSTRUCTORS</h1>
        </div>

        {/* Table Header */}
        <div className="flex p-4 bg-gray-50 rounded-lg">
          <p className="w-1/12 text-xs font-bold opacity-30">#</p>
          <p className="w-1/4 text-xs font-bold opacity-30">NAME</p>
          <p className="w-1/5 text-xs font-bold opacity-30">SPECIALIZATION</p>
          <p className="w-1/4 text-xs font-bold opacity-30 text-right">ACTIONS</p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-sm opacity-40 py-8">Loading instructors...</p>
        )}
        {error && (
          <p className="text-center text-sm text-red-500 py-8">Error: {error}</p>
        )}
        {!loading && !error && instructors.length === 0 && (
          <p className="text-center text-sm opacity-40 py-8">No instructors found.</p>
        )}

        {/* Rows */}
        {!loading && !error && instructors.map((instructor, index) => (
          <div key={instructor._id} className="flex p-4 items-center">
            <p className="w-1/12 text-sm font-bold opacity-40">{index + 1}</p>

            <div className="w-1/4">
              <p className="text-sm font-medium">{instructor.name}</p>
            </div>

            <div className="w-1/5">
              <span className="bg-blue-200 text-blue-600 px-3 py-1 rounded-2xl text-xs">
                {instructor.specialization}
              </span>
            </div>

            <div className="flex w-1/4 justify-end gap-2">
              <button
                onClick={() => openEdit(instructor)}
                className="px-4 py-1 text-blue-600 border rounded-2xl hover:bg-blue-50 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(instructor._id)}
                className="px-4 py-1 text-red-500 border border-red-200 rounded-2xl hover:bg-red-50 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add Modal ─────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-serif font-semibold mb-4">Add Instructor</h2>

            <label className="block text-xs font-semibold opacity-50 mb-1">NAME</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label className="block text-xs font-semibold opacity-50 mb-1">SPECIALIZATION</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. MERN Stack"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />

            {formError && <p className="text-red-500 text-xs mb-3">{formError}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-2xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-serif font-semibold mb-4">Edit Instructor</h2>

            <label className="block text-xs font-semibold opacity-50 mb-1">NAME</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />

            <label className="block text-xs font-semibold opacity-50 mb-1">SPECIALIZATION</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={editForm.specialization}
              onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
            />

            {editError && <p className="text-red-500 text-xs mb-3">{editError}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 text-sm border rounded-2xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editSubmitting}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50"
              >
                {editSubmitting ? "Saving..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Instructors;