import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage/LoginPage";
import MyPage from "./components/mypage/MyPage";
import PokerPage from "./components/pokerPage/PokerPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/PokerPage" element={<PokerPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
