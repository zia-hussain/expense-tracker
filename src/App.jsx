import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; // Adjust the path if necessary
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Singup from "./components/signup/Signup";
import PrivateRoute from "./components/PrivateRoute"; // Adjust the path if necessary
import Signup from "./components/signup/Signup";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
