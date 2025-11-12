import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { addRefresh } from "../utils/refresh";

const Navbar = () => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [active, setActive] = useState("Dashboard");

    const location = useLocation();
    const path = location.pathname;

    
    
    useEffect(() => {
        if (!path) {
            return;
        }
        if (path == "/") {
          setActive("Dashboard");
        } else if (path == "/leaderboard") {
          setActive("Leaderboard");
        } else if (path == "/report") {
          setActive("Report");
        } else if (path == "/profile") {
          setActive("Profile");
        } else if (path == "/Expense/AI") {
          setActive("AI");
        }
    },[path])

    
    const handleLogout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/Logout`, {
                method:"POST",
              credentials: "include",
            });

            if (res.ok) {
                dispatch(removeUser());
                dispatch(addRefresh());
                navigate("/Auth")
            }
        }
        catch (err) {
            console.log(err)
        }
    }

   
    
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-600 tracking-tight">
        ExpenseTracker
      </Link>

      {user && (
        <>
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                active === "Dashboard"
                  ? "text-green-600 underline"
                  : "text-gray-800 hover:text-green-600 hover:underline"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                active === "Profile"
                  ? "text-green-600 underline"
                  : "text-gray-800 hover:text-green-600 hover:underline"
              }`}
            >
              Profile
            </Link>
            <Link
              to="/leaderboard"
              className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                active === "Leaderboard"
                  ? "text-green-600 underline"
                  : "text-gray-800 hover:text-green-600 hover:underline"
              }`}
            >
              LeaderBoard
            </Link>
            <Link
              to="/report"
              className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                active === "Report"
                  ? "text-green-600 underline"
                  : "text-gray-800 hover:text-green-600 hover:underline"
              }`}
            >
              Report
            </Link>

            <Link
              to="/Expense/AI"
              className={`font-semibold tracking-wide transition-all duration-300 underline-offset-4 ${
                active === "AI"
                  ? "text-green-600 underline"
                  : "text-gray-800 hover:text-green-600 hover:underline"
              }`}
            >
              AI
            </Link>
          </div>

          {/* Logout + User Info (grouped together) */}
          <div className="flex items-center space-x-4">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <img
                src={
                  user.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="User"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="text-gray-700 font-medium">
                {user.name || "User"}
              </span>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
