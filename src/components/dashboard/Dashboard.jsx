import { useState, useEffect } from "react";
import { TrashIcon, MoonIcon, SunIcon, StarIcon, LogOut } from "lucide-react";

import { FaDollarSign, FaCalendarAlt, FaListUl, FaPlus } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  deleteExpense,
  selectExpenses,
} from "../../redux/features/expenseSlice";
import { loginSuccess, logout } from "@/redux/features/authSlice";
import { ref } from "firebase/database";
import { db } from "@/firebase/firebaseConfig";

const categories = ["Food", "Travel", "Entertainment", "Rent", "Other"];

function Dashboard() {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);

  const [darkMode, setDarkMode] = useState(true);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    notes: "",
  });
  const [userName, setUserName] = useState("John Doe");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.category === "0") {
      alert("Please select a valid category.");
      return;
    }

    const newExpenseWithId = { ...newExpense, id: Date.now() };

    dispatch(addExpense(newExpenseWithId));

    setNewExpense({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "Food",
      notes: "",
    });
  };

  const openDetailModal = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteExpense(expenseToDelete.id));
    setShowDeleteModal(false);
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const budget = 1000;

  const chartData = categories.map((category) => ({
    name: category,
    amount: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount), 0),
  }));

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Expense Tracker
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
            <button
              onClick={() => handleLogout()}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            className={`col-span-full rounded-xl shadow-xl p-8 text-white relative overflow-hidden ${
              darkMode
                ? "bg-gradient-to-r from-[#0A2640] to-[#1C3D5B]"
                : "bg-white text-gray-900"
            }`}
          >
            {darkMode && (
              <>
                <div className="absolute top-0 left-0 w-full h-full bg-blue-400 opacity-30 transform -translate-x-1/2 -translate-y-1/2 rounded-full -z-10"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-purple-500 opacity-30 transform translate-x-1/2 translate-y-1/2 rounded-full -z-10"></div>
              </>
            )}
            <div className="flex items-center mb-4">
              <StarIcon
                size={32}
                className={`mr-3 transform rotate-12 ${
                  darkMode ? "text-yellow-300" : "text-yellow-500"
                }`}
              />
              <h2
                className={`text-3xl font-extrabold ${
                  darkMode ? "text-white" : "text-[#3B82F6]"
                }`}
              >
                Hello, {userName}!
              </h2>
            </div>
            <p
              className={`text-lg leading-relaxed ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Welcome back to your personal dashboard! We’ve prepared some
              exciting updates and insights for you today. Keep an eye on your
              budget, track your expenses, and make the most out of your day!
            </p>
          </div>

          <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Expense Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Budget Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Budget:</span>
                <span className="font-semibold">${budget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Expenses:</span>
                <span className="font-semibold">
                  ${totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Remaining:</span>
                <span className="font-semibold">
                  ${(budget - totalExpenses).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min((totalExpenses / budget) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              Add New Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {/* Amount Field */}
                <div className="flex-1 relative">
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDollarSign className="text-gray-400" />
                    </span>
                    <input
                      placeholder="Amount"
                      type="number"
                      id="amount"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      required
                      className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                  </div>
                </div>

                {/* Date Field */}
                <div className="flex-1 relative">
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </span>
                    <input
                      placeholder="Date"
                      type="date"
                      id="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                      required
                      className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              {/* Category Field */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaListUl className="text-gray-400" />
                  </span>
                  <select
                    id="category"
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-shadow"
                  >
                    <option value="0">Choose a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes Field */}
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="notes"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Notes..."
                  value={newExpense.notes}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, notes: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-shadow"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add Expense
              </button>
            </form>
          </div>

          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Recent Expenses
            </h2>
            {expenses.length === 0 ? (
              <p>No expenses recorded yet.</p>
            ) : (
              <ul className="space-y-4 ">
                {expenses.map((expense) => (
                  <li
                    key={expense.id}
                    onClick={() => openDetailModal(expense)}
                    className={`flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-[1.02] cursor-pointer transition-all duration-300 ${
                      darkMode
                        ? "hover:!bg-gray-600 hover:shadow-xl"
                        : "hover:!bg-gray-200 hover:shadow-xl"
                    }`}
                  >
                    <div className="w-full">
                      <span className="block text-lg font-semibold">
                        ${expense.amount}
                      </span>
                      <p className="text-gray-500 w-1/2">{expense.notes}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(expense);
                        }}
                        className="ml-4 text-red-500 hover:text-red-700 transition duration-200"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail Modal */}
          {showDetailModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Expense Details
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                {selectedExpense && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${selectedExpense.amount}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Date
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {new Date(selectedExpense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Category
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {selectedExpense.category}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Notes
                      </p>
                      <p className="text-lg text-gray-800 dark:text-gray-200">
                        {selectedExpense.notes}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this expense?</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
