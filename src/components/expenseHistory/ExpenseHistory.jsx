import { deleteExpenseFromFirebase } from "@/firebase/service"; // Firebase deletion function
import { deleteExpense, selectExpenses } from "@/redux/features/expenseSlice";
import { Skeleton } from "@mui/material";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth"; // Firebase auth to get user ID

const ExpenseHistory = ({ loading }) => {
  const dispatch = useDispatch();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const expenses = useSelector(selectExpenses);

  const auth = getAuth(); // Get the Firebase Auth instance
  const userId = auth.currentUser?.uid; // Get the current logged-in user ID

  // Open delete confirmation modal
  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  // Confirm and delete an expense
  const confirmDelete = async () => {
    try {
      // Ensure there's a logged-in user
      if (!userId) {
        toast.error("User is not authenticated.");
        return;
      }

      // 1. Delete from Firebase
      await deleteExpenseFromFirebase(expenseToDelete.id, userId);

      // 2. Dispatch Redux action to update the state
      dispatch(deleteExpense(expenseToDelete.id));

      // 3. Show success notification
      toast.success("Expense deleted successfully.");

      // 4. Close the modal
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
      setShowDeleteModal(false);
    }
  };

  const openDetailModal = (expense) => {
    setSelectedExpense(expense);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
          Recent Expenses
        </h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton
              className="dark:bg-gray-700 rounded-lg"
              variant="rectangular"
              height={40}
            />
            <Skeleton className="dark:bg-gray-700 rounded-lg" variant="text" />
            <Skeleton
              className="dark:bg-gray-700 rounded-lg"
              variant="text"
              width="80%"
            />
            <Skeleton
              className="dark:bg-gray-700 rounded-lg"
              variant="rectangular"
              height={40}
            />
            <Skeleton className="dark:bg-gray-700 rounded-lg" variant="text" />
            <Skeleton
              className="dark:bg-gray-700 rounded-lg"
              variant="text"
              width="80%"
            />
          </div>
        ) : expenses.length === 0 ? (
          <p>No expenses recorded yet.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-[1.02] cursor-pointer transition-all duration-300 border border-gray-300 dark:border-gray-600"
              >
                <div
                  className="w-full"
                  onClick={() => openDetailModal(expense)}
                >
                  <span className="block text-lg font-semibold">
                    Rs: {expense.amount}
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 border border-gray-300 dark:border-gray-600">
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
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
                    Rs: {selectedExpense.amount}
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 border border-gray-300 dark:border-gray-600">
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
    </>
  );
};

export default ExpenseHistory;
