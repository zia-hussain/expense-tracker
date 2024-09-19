import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    notes: "",
  });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budget, setBudget] = useState(1000);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Placeholder for Firebase Firestore fetch
    const fetchExpenses = async () => {
      // Simulating data fetch
      setExpenses([
        {
          id: "1",
          amount: 50,
          date: "2023-05-01",
          category: "Food",
          notes: "Groceries",
        },
        {
          id: "2",
          amount: 30,
          date: "2023-05-02",
          category: "Travel",
          notes: "Bus fare",
        },
        {
          id: "3",
          amount: 100,
          date: "2023-05-03",
          category: "Entertainment",
          notes: "Movie night",
        },
      ]);
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  }, [expenses]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddExpense = () => {
    const expenseWithId = { ...newExpense, id: Date.now().toString() };
    setExpenses([...expenses, expenseWithId]);
    setNewExpense({
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: "Food",
      notes: "",
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const chartData = categories.map((category) => ({
    name: category,
    amount: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full"
          >
            {darkMode ? (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Budget: ${budget.toFixed(2)}</p>
                <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
                <p>Remaining: ${(budget - totalExpenses).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddExpense();
                }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              >
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount || ""}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  required
                />
                <Select
                  value={newExpense.category}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Notes"
                  value={newExpense.notes}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, notes: e.target.value })
                  }
                />
                <Button type="submit" className="md:col-span-2 lg:col-span-4">
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-secondary"
                  >
                    <div>
                      <p className="font-semibold">
                        ${expense.amount.toFixed(2)} - {expense.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {expense.date} - {expense.notes}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
