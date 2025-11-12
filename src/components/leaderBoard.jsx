// import React, { useEffect, useState } from "react";
// import { BASE_URL } from "../utils/constant";

// const LeaderBoard = () => {
//   const [leaders, setLeaders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchLeaderboard = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/Premium/Leaderboard`, {
//         method: "GET",
//         credentials: "include",
//       });
//       const data = await res.json();

//       // ✅ no need to sort, using backend order
//       setLeaders(data.result || []);
//     } catch (err) {
//       console.error("Error fetching leaderboard:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
//         Loading Leaderboard...
//       </div>
//     );

//   return (
//     <div className="flex flex-col items-center bg-gray-50 min-h-screen p-8">
//       <h1 className="text-3xl font-bold text-green-700 mb-8">
//         💰 Expense Leaderboard
//       </h1>

//       <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-green-600 text-white">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-semibold">
//                 Rank
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">
//                 Total Expense (₹)
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold">
//                 No. of Expenses
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaders.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="4"
//                   className="text-center py-6 text-gray-500 italic"
//                 >
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               leaders.map((user, index) => (
//                 <tr
//                   key={user.UserId}
//                   className={`${
//                     index === 0
//                       ? "bg-yellow-50"
//                       : index === 1
//                       ? "bg-gray-100"
//                       : index === 2
//                       ? "bg-orange-50"
//                       : "bg-white"
//                   } border-b hover:bg-gray-50 transition`}
//                 >
//                   <td className="px-6 py-4 font-bold text-gray-700">
//                     #{index + 1}
//                   </td>
//                   <td className="px-6 py-4 flex items-center space-x-3">
//                     <img
//                       src={
//                         user["User.photoUrl"] ||
//                         "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                       }
//                       alt="User"
//                       className="w-10 h-10 rounded-full border border-gray-300 object-cover"
//                     />
//                     <span className="font-medium text-gray-800">
//                       {user["User.name"]}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-green-700 font-semibold">
//                     ₹
//                     {user.Total_Expense.toLocaleString(undefined, {
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {user.Number_of_Expense}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LeaderBoard;





import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/Premium/Leaderboard`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setLeaders(data.result || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Leaderboard...
      </div>
    );

  // background colors for top 3
  const getRowClass = (index) => {
    if (index === 0) return "bg-yellow-100"; // gold
    if (index === 1) return "bg-gray-200"; // silver
    if (index === 2) return "bg-amber-200"; // bronze
    return "bg-white";
  };

  // emoji medals for top 3
  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        💰 Expense Leaderboard
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                User
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Total Expense (₹)
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                No. of Expenses
              </th>
            </tr>
          </thead>

          <tbody>
            {leaders.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No data available
                </td>
              </tr>
            ) : (
              leaders.map((user, index) => (
                <tr
                  key={user.UserId}
                  className={`${getRowClass(
                    index
                  )} border-b hover:bg-gray-50 transition`}
                >
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {getMedal(index)}
                  </td>

                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={
                        user["User.photoUrl"] ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {user["User.name"]}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-green-700 font-semibold">
                    ₹
                    {user.Total_Expense.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {user.Number_of_Expense}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
