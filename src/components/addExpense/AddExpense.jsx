import { auth } from "@/firebase/firebaseConfig";
import { getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { FaCalendarAlt, FaListUl, FaMoneyBill, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const AddExpense = () => {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    notes: "",
  });
  const categories = ["Food", "Travel", "Entertainment", "Rent", "Other"];

  const handleAddExpense = async (event) => {
    event.preventDefault();
    const expenseData = {
      category: newExpense.category,
      amount: newExpense.amount,
      date: newExpense.date,
      notes: newExpense.notes,
    };
    const userId = auth.currentUser.uid;

    try {
      await set(
        ref(getDatabase(), `users/${userId}/expenses/${Date.now()}`),
        expenseData
      );
      toast.success(
        `Expense of Rs ${newExpense.amount} has been successfully recorded!`
      );

      setNewExpense({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        notes: "",
      }); // Reset state
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to save the expense. Please try again.");
    }
  };

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Add New Expense
      </h2>
      <form onSubmit={handleAddExpense} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          {/* Amount Field */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium mb-2" htmlFor="amount">
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMoneyBill className="text-gray-400" />
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
            <label className="block text-sm font-medium mb-2" htmlFor="date">
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
          <label className="block text-sm font-medium mb-2" htmlFor="category">
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
          <label className="block text-sm font-medium mb-2" htmlFor="notes">
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
  );
};

export default AddExpense;
