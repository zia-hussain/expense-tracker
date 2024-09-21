import { createSlice } from "@reduxjs/toolkit";

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
  },
});

// Export the actions
export const { addExpense, deleteExpense, setExpenses } = expenseSlice.actions;

// Selector
export const selectExpenses = (state) => state.expenses.expenses;

// Export the reducer
export default expenseSlice.reducer;
