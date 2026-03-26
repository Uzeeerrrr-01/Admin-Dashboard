import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";  
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        
        <Sidebar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/instructors" element={<Instructors />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;