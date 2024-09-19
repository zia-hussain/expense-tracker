import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from "lucide-react";
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

const categories = ["Food", "Travel", "Entertainment", "Rent", "Other"];

function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    notes: "",
  });
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 50,
      category: "Food",
      date: "2023-05-15",
      notes: "Groceries",
    },
    {
      id: 2,
      amount: 30,
      category: "Travel",
      date: "2023-05-16",
      notes: "Bus fare",
    },
    {
      id: 3,
      amount: 20,
      category: "Entertainment",
      date: "2023-05-17",
      notes: "Movie ticket",
    },
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpenseWithId = { ...newExpense, id: Date.now() };
    setExpenses([...expenses, newExpenseWithId]);
    setNewExpense({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "Food",
      notes: "",
    });
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Expense Tracker
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  style={{ width: `${(totalExpenses / budget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              Add New Expense
            </h2>
            <form
              onSubmit={handleAddExpense}
              className="grid grid-cols-1 gap-6"
            >
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow"
                required
              />

              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow"
                required
              />

              <div className="relative">
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              <input
                type="text"
                placeholder="Notes"
                value={newExpense.notes}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, notes: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold"
              >
                <PlusIcon size={20} className="mr-2" /> Add Expense
              </button>
            </form>
          </div>

          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Expense List
            </h2>
            <ul className="space-y-4">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">
                      {expense.category}: ${expense.amount}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {expense.date} - {expense.notes}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setExpenses(
                        expenses.filter((item) => item.id !== expense.id)
                      )
                    }
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                  >
                    <TrashIcon size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
