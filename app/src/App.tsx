import "./App.css";

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useAuthContext } from "./contexts/AuthContext";

function App() {
  const { authUser } = useAuthContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
