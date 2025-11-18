import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { addRefresh } from "../utils/refresh";

export default function Profile() {
  const user = useSelector((state) => state.user);
  const [form, setForm] = useState({ name: "", phone: "", photoUrl: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        photoUrl: user.photoUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/Profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update profile");
        dispatch(addRefresh());
      setMessage("Profile updated successfully ✨");
    } catch (err) {
      setMessage("Error updating profile ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Profile Settings 👤
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={form.photoUrl || "https://via.placeholder.com/120"}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border shadow"
          />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm">Photo URL</label>
            <input
              type="text"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Paste image link"
            />
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg shadow hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </motion.button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-700 font-medium mt-2">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
