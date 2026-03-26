import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-linear-to-b from-[#0f1f4b] via-[#1f2f6b] to-[#2f4b9a] w-72 ">

      <div className="flex flex-row gap-1 p-4">
        <img src="dashboard.png" className="w-12 h-12 mt-4"/>
        <div className="flex flex-col mt-4">
          <h1 className="text-2xl font-semibold text-white font-mono">CourseManager</h1>
          <p className="font-bold text-xs text-violet-300 font-sans opacity-50">ADMINPANEL</p>    
        </div>
      </div>

      <p className="border-b border-white opacity-50"></p>

      {/* navigation links */}
      <div className="flex flex-col gap-2">

        <NavLink to="/">
          <div className="flex flex-row gap-1 mt-5 hover:bg-[#ffffff14] items-center h-12 rounded-xl">
            <img src="square.png" className="w-7 h-7 mt-1 ml-8"/>
            <p className="text-lg font-semibold text-gray-200 hover:text-white">DASHBOARD</p>
          </div>
        </NavLink>

        <NavLink to="/courses">
          <div className="flex flex-row gap-1 mt-5 hover:bg-[#ffffff14] items-center h-12 rounded-xl">
            <img src="book.png" className="w-9 h-7 mt-1 ml-8"/>
            <p className="text-lg font-semibold text-gray-200 hover:text-white">COURSES</p>
          </div>
        </NavLink>

        <NavLink to="/instructors">
          <div className="flex flex-row gap-1 mt-5 hover:bg-[#ffffff14] items-center h-12 rounded-xl">
            <img src="people.png" className="w-14 h-10 mt-1 ml-4"/>
            <p className="text-lg font-semibold text-gray-200 hover:text-white">INSTRUCTOR</p>
          </div>
        </NavLink>

      </div>

      {/* admin */}
      <div className="mt-70">
        <p className="border-b border-white"></p>

        <div className="flex flex-col ml-5 mt-4">
          <h1 className="font-bold text-white text-lg">Admin User</h1>
          <p className="font-medium text-sm text-white opacity-50">Admin@cousemanger.io</p>
        </div>

        <h1 className="text-lg ml-5 font-semibold text-white mt-2">LogOut</h1>
      </div>

    </div>
  );
};

export default Sidebar;