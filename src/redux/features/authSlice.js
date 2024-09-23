// redux/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { clearExpenses } from "./expenseSlice"; // Import the clearExpenses action

const initialState = {
  isAuthenticated: !!localStorage.getItem("user"),
  user: JSON.parse(localStorage.getItem("user")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

// Thunk for logging out
export const logout = () => (dispatch) => {
  dispatch(logoutSuccess()); // Call the logout reducer
  dispatch(clearExpenses()); // Clear expenses after logout
};

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
