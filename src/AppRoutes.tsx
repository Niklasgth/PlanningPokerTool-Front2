import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import MyPage from "./components/mypage/MyPage";
import RegisterPage from "./components/loginPage/RegisterPage";
import PokerPage from "./components/pokerPage/PokerPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/PokerPage" element={
          <ProtectedRoute> 
            <PokerPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
