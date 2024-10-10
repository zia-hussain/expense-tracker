import { useState } from "react";
import SalaryUpdateModal from "../dashboard/SalaryUpdateModal";
import { useSelector } from "react-redux";
import { selectExpenses } from "@/redux/features/expenseSlice";

const ExpenseOverview = ({ loading, budget, salary }) => {
  const expenses = useSelector(selectExpenses);

  const [openModal, setOpenModal] = useState(false);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full border border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
          Budget Overview
        </h2>
        {loading ? (
          <div className="space-y-4 flex-grow">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ) : (
          <div className="flex-grow">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span>Budget:</span>
                <span className="font-semibold">Rs {budget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Expenses:</span>
                <span className="font-semibold">
                  Rs {totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Remaining:</span>
                <span className="font-semibold">
                  Rs {(budget - totalExpenses).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min((totalExpenses / budget) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-auto">
          <button
            onClick={() => setOpenModal(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Update Budget
          </button>
        </div>
        <SalaryUpdateModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          currentSalary={salary}
        />
      </div>
    </>
  );
};

export default ExpenseOverview;
