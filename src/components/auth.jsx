import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
    
    const dispatch = useDispatch();
    const navigate=useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    if (isLogin) {
      // 🟢 LOGIN API CALL
      const res = await fetch(`${BASE_URL}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData), // { email, password }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");
        console.log("Login Response:", data);
          dispatch(addUser(data.Data))
          navigate("/")
        // Optionally save token here: localStorage.setItem("token", data.token);
      } else {
        setMessage(
          data.message || "❌ Login failed! Please check your credentials."
        );
      }
    } else {
      // 🟢 SIGNUP API CALL
      const res = await fetch(`${BASE_URL}/SignUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(signupData), // { name, email, phone, password }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Signup successful! You can now log in.");
        console.log("Signup Response:", data);
        // Optionally reset signup fields
          setSignupData({ name: "", email: "", phone: "", password: "" });
          dispatch(addUser(data.Data));
           navigate("/");
      } else {
        setMessage(data.message || "❌ Signup failed! Try again.");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    setMessage("⚠️ Network or Server Error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={isLogin ? loginData.email : signupData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            name="password"
            value={isLogin ? loginData.password : signupData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-70"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") || message.startsWith("🎉")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
