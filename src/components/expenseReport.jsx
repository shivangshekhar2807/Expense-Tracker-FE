import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useSelector } from "react-redux";

const ExpenseReport = () => {
  const [reportType, setReportType] = useState("month"); // "date", "month", or "year"
  const [dateInput, setDateInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  


  const fetchReport = async () => {
    try {
      setLoading(true);
      let query = "";

      if (reportType === "date") query = `?date=${dateInput}`;
      else if (reportType === "month")
        query = `?month=${monthInput}&year=${yearInput}`;
      else if (reportType === "year") query = `?year=${yearInput}`;

      const res = await fetch(`${BASE_URL}/Premium/Report/${query}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // ✅ Download CSV
  const handleDownload = () => {
    if (!reportData?.data?.length) return;

    const headers = [
      "ID",
      "Description",
      "Category",
      "ExpenseAmount",
      "CreatedAt",
    ];
    const rows = reportData.data.map((item) => [
      item.id,
      item.Description,
      item.Category,
      item.ExpenseAmount,
      new Date(item.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Expense_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className=" min-h-screen bg-gray-50 px-8 py-10">
      <div className="flex justify-between">
        <div >
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            📊 Expense Report
          </h1>
        </div>

        <div>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Download Expense
          </button>
        </div>
      </div>

      {/* Report Filter Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-6"
        >
          {/* Report Type Selection */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Select Report Type:
            </label>
            <div className="flex space-x-4">
              {["date", "month", "year"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-medium border ${
                    reportType === type
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setReportType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Input Fields */}
          {reportType === "date" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Select Date:
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-48"
                required
              />
            </div>
          )}

          {reportType === "month" && (
            <>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Month:
                </label>
                <select
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-36"
                  required
                >
                  <option value="">Select</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Year:
                </label>
                <input
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-36"
                  placeholder="2025"
                  required
                />
              </div>
            </>
          )}

          {reportType === "year" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Year:
              </label>
              <input
                type="number"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-36"
                placeholder="2025"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Generate Report
          </button>
        </form>
      </div>

      {/* Report Display Section */}
      {loading ? (
        <p className="text-gray-600">Loading report...</p>
      ) : reportData ? (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          {/* Summary Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Report Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Total Records:</span>{" "}
                {reportData.meta.totalRecords}
              </div>
              <div>
                <span className="font-semibold">Total Expense:</span> ₹
                {parseFloat(reportData.meta.totalExpense).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Period Start:</span>{" "}
                {new Date(reportData.meta.period.start).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Period End:</span>{" "}
                {new Date(reportData.meta.period.end).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Amount (₹)</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.data.map((exp, index) => (
                <tr
                  key={exp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{exp.Description}</td>
                  <td className="px-4 py-2">{exp.Category}</td>
                  <td className="px-4 py-2 text-green-700 font-medium">
                    ₹{exp.ExpenseAmount}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 italic">
          Please generate a report to see your expenses.
        </p>
      )}
    </div>
  );
};

export default ExpenseReport;
