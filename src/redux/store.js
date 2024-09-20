// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./features/expenseSlice";
import authReducer from "./features/authSlice"; // Import the auth slice reducer

const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    auth: authReducer, // Add auth reducer
  },
});

export default store;
