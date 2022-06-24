import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuthContext } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { Role } from "./models/user";

function App() {
  const { authUser, accessToken } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={authUser && accessToken ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={
            authUser && accessToken ? (
              authUser.role === Role.User ? (
                <Dashboard />
              ) : (
                <AdminDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
