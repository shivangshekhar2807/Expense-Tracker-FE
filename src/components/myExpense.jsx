// import React, { useEffect, useState } from "react";
// import { BASE_URL } from "../utils/constant";

// const MyExpenseTracker = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [formData, setFormData] = useState({
//     ExpenseAmount: "",
//     Description: "",
//     Category: "",
//   });

//   // Fetch all expenses
//   const fetchExpenses = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/Expense`, {
//         method: "GET",
//         credentials: "include",
//       });
//       const data = await res.json();
//       setExpenses(data.results || []);
//     } catch (err) {
//       console.error("Error fetching expenses:", err);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // Handle form input
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle Add Expense
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${BASE_URL}/Expense`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Failed to add expense");

//       setFormData({ ExpenseAmount: "", Description: "", Category: "" });
//       fetchExpenses();
//     } catch (err) {
//       console.error("Error adding expense:", err);
//     }
//   };

//   // Handle Delete Expense
//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${BASE_URL}/Expense/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (res.ok) fetchExpenses();
//     } catch (err) {
//       console.error("Error deleting expense:", err);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* LEFT SECTION - Expenses List */}
//       <div className="w-3/4 p-6 overflow-y-auto border-r border-gray-200">
//         <h2 className="text-2xl font-bold text-green-700 mb-4">
//           Your Expenses
//         </h2>

//         {expenses.length === 0 ? (
//           <p className="text-gray-500 text-center mt-20">
//             No expenses found. Add your first one!
//           </p>
//         ) : (
//           <div className="flex flex-wrap gap-4">
//             {expenses.map((expense) => (
//               <div
//                 key={expense.id}
//                 className="bg-white shadow-md rounded-xl p-5 w-[calc(33.333%-1rem)] flex flex-col justify-between border border-gray-100 hover:shadow-lg transition"
//               >
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     ₹{expense.ExpenseAmount}
//                   </h3>
//                   <p className="text-gray-500 text-sm mt-1">
//                     {expense.Category}
//                   </p>
//                   <p className="text-gray-600 mt-2 text-sm line-clamp-2">
//                     {expense.Description}
//                   </p>
//                 </div>

//                 <div className="flex items-center justify-between mt-4">
//                   <div className="flex items-center space-x-2">
//                     <img
//                       src={
//                         expense.User?.photoUrl ||
//                         "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                       }
//                       alt="user"
//                       className="w-8 h-8 rounded-full border"
//                     />
//                     <span className="text-sm text-gray-700 font-medium">
//                       {expense.User?.name}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => handleDelete(expense.id)}
//                     className="text-red-500 text-sm font-medium hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* RIGHT SECTION - Add Expense Form */}
//       <div className="w-1/4 bg-white p-6 shadow-lg sticky top-0 h-screen">
//         <h2 className="text-xl font-bold text-green-700 mb-4">Add Expense</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Expense Amount
//             </label>
//             <input
//               type="number"
//               name="ExpenseAmount"
//               value={formData.ExpenseAmount}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter amount"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Description
//             </label>
//             <textarea
//               name="Description"
//               value={formData.Description}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter description"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Category
//             </label>
//             <select
//               name="Category"
//               value={formData.Category}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               required
//             >
//               <option value="">Select category</option>
//               <option value="Food">Food</option>
//               <option value="Travel">Travel</option>
//               <option value="Entertainment">Entertainment</option>
//               <option value="Shopping">Shopping</option>
//               <option value="Bills">Bills</option>
//               <option value="Health">Health</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//           >
//             Add Expense
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MyExpenseTracker;



import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    ExpenseAmount: "",
    Description: "",
    Category: "",
  });

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/Expense`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setExpenses(data.results || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/Expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      setFormData({ ExpenseAmount: "", Description: "", Category: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/Expense/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDE - EXPENSE TABLE */}
      <div className="w-3/4 p-6 overflow-y-auto border-r border-gray-300">
        {/* <h2 className="text-2xl font-bold text-green-700 mb-6">
          Expense Records
        </h2> */}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                {/* <th className="px-4 py-3 text-left">Name</th> */}
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Amount (₹)</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((exp, index) => (
                  <tr
                    key={exp.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    {/* <td className="px-4 py-3 flex items-center space-x-2">
                      <img
                        src={
                          exp.User?.photoUrl ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="User"
                        className="w-8 h-8 rounded-full border"
                      />
                      <span className="font-medium text-gray-800">
                        {exp.User?.name}
                      </span>
                    </td> */}
                    <td className="px-4 py-3 text-gray-700">{exp.Category}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[250px] truncate">
                      {exp.Description}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-700">
                      ₹{exp.ExpenseAmount}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE - ADD EXPENSE FORM */}
      <div className="w-1/4 bg-white p-6 shadow-lg sticky top-0 h-screen">
        <h2 className="text-xl font-bold text-green-700 mb-4">Add Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Expense Amount
            </label>
            <input
              type="number"
              name="ExpenseAmount"
              value={formData.ExpenseAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseTracker;
