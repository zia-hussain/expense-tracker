// redux/features/expenseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getDatabase, ref, set, remove } from "firebase/database";
import { auth } from "@/firebase/firebaseConfig";

const initialState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    deleteExpense(state, action) {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },
    setExpenses(state, action) {
      state.expenses = action.payload; // Set the expenses array
    },
    clearExpenses(state) {
      return initialState; // Reset expenses to the initial state
    },
  },
});

// Thunk to add an expense
export const addExpenseAsync = (expenseData) => async (dispatch) => {
  const userId = auth.currentUser.uid;
  const expenseId = Date.now();
  try {
    await set(ref(getDatabase(), `users/${userId}/expenses/${expenseId}`), {
      ...expenseData,
      id: expenseId,
    });
    // dispatch(addExpense({ ...expenseData, id: expenseId }))
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

// Thunk to delete an expense
export const deleteExpenseAsync = (expenseId) => async (dispatch) => {
  const userId = auth.currentUser.uid;
  try {
    await remove(ref(getDatabase(), `users/${userId}/expenses/${expenseId}`));
    dispatch(deleteExpense(expenseId)); // Dispatch action to Redux
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};

// Export the actions
export const { addExpense, deleteExpense, setExpenses, clearExpenses } =
  expenseSlice.actions;

// Selector
export const selectExpenses = (state) => state.expenses.expenses;

// Export the reducer
export default expenseSlice.reducer;
