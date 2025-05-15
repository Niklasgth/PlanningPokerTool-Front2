import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
// import LoginPage from "@pages/LoginPage"; // om du skapar en sån
import LoginPage from "./components/dashboard/loginPage/LoginPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
