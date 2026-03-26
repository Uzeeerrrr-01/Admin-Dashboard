import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api"; // 🔁 Change to your backend URL

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [instructorCount, setInstructorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => { 
      try {
        setLoading(true);
        setError(null);

        // Fetch courses and instructors in parallel
        const [coursesRes, instructorsRes] = await Promise.all([
          fetch(`${API_BASE}/courses`),
          fetch(`${API_BASE}/instructors`),
        ]);

        if (!coursesRes.ok) throw new Error(`Courses fetch failed: ${coursesRes.status}`);
        if (!instructorsRes.ok) throw new Error(`Instructors fetch failed: ${instructorsRes.status}`);

        const coursesData = await coursesRes.json();
        const instructorsData = await instructorsRes.json();

        setCourses(coursesData);
        setInstructorCount(instructorsData.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show only the 5 most recent courses in the table
  const recentCourses = courses.slice(0, 5);

  // Friendly date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen overflow-hidden">

      <div className="mt-2">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-lg font-medium opacity-50">
          Welcome back —{" "}
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-10 mt-5">

        <div className="w-1/2 h-26 rounded-3xl shadow-[4px_4px_10px_rgba(0,0,0,0.2)] bg-white flex flex-row gap-2 p-6 items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex justify-center items-center">
            <img src="blue.png" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-medium opacity-40 text-sm font-serif">TOTAL COURSES</h1>
            <h1 className="text-4xl font-sans font-semibold">
              {loading ? "—" : courses.length}
            </h1>
          </div>
        </div>

        <div className="w-1/2 h-26 rounded-3xl shadow-[4px_4px_10px_rgba(0,0,0,0.2)] flex flex-row bg-white p-6 gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex justify-center items-center mt-1">
            <img src="peop.png" className="w-5 h-5" />
          </div>
          <div className="flex flex-col mt-1">
            <h1 className="font-medium opacity-40 text-sm font-serif">TOTAL INSTRUCTORS</h1>
            <h1 className="text-4xl font-sans font-semibold">
              {loading ? "—" : instructorCount}
            </h1>
          </div>
        </div>

      </div>

      {/* Recent Courses Table */}
      <div className="w-full h-full bg-white mt-5 p-6 rounded-2xl shadow-[4px_4px_10px_rgba(0,0,0,0.2)]">

        <div className="flex flex-row justify-between">
          <h1 className="font-semibold text-lg px-2 py-2 font-serif">RECENT COURSES</h1>
          {!loading && !error && (
            <p className="bg-gray-300 w-18 opacity-40 mr-5 mt-2 h-6 rounded-xl text-center text-sm px-3">
              {recentCourses.length} shown
            </p>
          )}
        </div>

        {/* Column Headers */}
        <div className="flex flex-row p-4 bg-gray-50 rounded-lg">
          <p className="w-1/3 text-xs font-bold opacity-30">COURSE NAME</p>
          <p className="w-1/4 text-xs font-bold opacity-30">INSTRUCTOR</p>
          <p className="w-1/6 text-xs font-bold opacity-30">DURATION</p>
          <p className="w-1/4 text-xs font-bold opacity-30 text-right">ADDED</p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-sm opacity-40 py-8">Loading courses...</p>
        )}
        {error && (
          <p className="text-center text-sm text-red-500 py-8">Error: {error}</p>
        )}
        {!loading && !error && recentCourses.length === 0 && (
          <p className="text-center text-sm opacity-40 py-8">No courses found.</p>
        )}

        {/* Rows */}
        {!loading && !error && recentCourses.map((course) => (
          <div key={course._id} className="flex flex-row p-4 border-b last:border-0">
            <p className="w-1/3 font-medium text-lg">{course.courseName || course.title || course.name}</p>
            <p className="w-1/4 font-medium text-lg">{course.instructor}</p>
            <p className="w-1/6 font-medium text-sm mt-1">
              <span className="bg-blue-200 text-blue-600 px-3 py-1 rounded-2xl">
                {course.duration}
              </span>
            </p>
            <p className="w-1/4 font-medium text-sm opacity-40 text-right">
              {formatDate(course.createdAt || course.addedOn)}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;