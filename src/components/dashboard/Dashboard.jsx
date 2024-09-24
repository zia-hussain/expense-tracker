import { useState, useEffect } from "react";
import { MoonIcon, SunIcon, StarIcon, LogOut } from "lucide-react";
import { Skeleton } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { selectExpenses, setExpenses } from "../../redux/features/expenseSlice";
import { logout } from "@/redux/features/authSlice";
import { getDatabase, onValue, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SalaryUpdateModal from "./SalaryUpdateModal";
import ModernBarChart from "./ModernBarChart";
import AddExpense from "../addExpense/AddExpense";
import ExpenseHistory from "../expenseHistory/ExpenseHistory";
import ExpenseOverview from "../expenseOverview/ExpenseOverview";
import Intro from "../intro/Intro";

const categories = ["Food", "Travel", "Entertainment", "Rent", "Other"];

function Dashboard() {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);

  const [darkMode, setDarkMode] = useState(true);

  const auth = getAuth();
  const [userName, setUserName] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [userSalary, setUserSalary] = useState(0);
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserExpenses(user.uid);
        fetchUserName(user.uid);
        fetchSalary(user.uid);
      } else {
        console.error("No user is currently logged in");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch real-time expenses
  const fetchUserExpenses = async (userId) => {
    const userRef = ref(getDatabase(), `users/${userId}/expenses`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expensesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        dispatch(setExpenses(expensesArray));
      } else {
        console.log("No expenses found for this user.");
        dispatch(setExpenses([]));
      }
      setLoading(false);
    });
  };

  // Fetch username
  const fetchUserName = async (userId) => {
    const userNameRef = ref(getDatabase(), `users/${userId}`);
    onValue(userNameRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.name) {
        setUserName(userData.name || "Guest");
      }
    });
  };

  // Fetch salary in real-time and update budget
  const fetchSalary = async (userId) => {
    const userSalaryRef = ref(getDatabase(), `users/${userId}/salary`);
    onValue(userSalaryRef, (snapshot) => {
      const salaryData = snapshot.val();
      if (salaryData) {
        setUserSalary(salaryData);
        setSalary(salaryData);
        setBudget(salaryData);
      }
    });
  };

  // Open modal for expense details

  // Add new expense to Firebase

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  const confirmLogout = () => {
    handleLogout(); // Call your logout function
    setShowLogoutModal(false); // Close the modal
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  // Prepare data for chart visualization
  const chartData = categories.map((category) => ({
    name: category,
    amount: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount), 0),
  }));

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
              {darkMode ? (
                <SunIcon className="rotate-animation" size={20} />
              ) : (
                <MoonIcon className="littlerotate-animation" size={20} />
              )}
            </button>
            <button
              onClick={openLogoutModal}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <LogOut className="bounce-animation" size={20} />
            </button>
          </div>
        </div>
        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)} // Close modal
                  className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout} // Confirm logout
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Intro darkMode={darkMode} userName={userName} loading={loading} />
          <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Expense Overview
            </h2>
            {loading ? (
              <Skeleton
                className="rounded-lg dark:bg-gray-700"
                variant="rect"
                width="100%"
                height={300}
              />
            ) : (
              <ModernBarChart chartData={chartData} />
            )}
          </div>
          <ExpenseOverview salary={salary} budget={budget} loading={loading} />
          <AddExpense />
          <ExpenseHistory loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
