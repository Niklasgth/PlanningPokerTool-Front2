
// Denna komponent skyddar sidor i vår app så att endast inloggade användare kan komma åt dem.
// Om ingen användare finns sparad i localStorage, omdirigeras användaren till inloggningssidan ('/').
// Exempel på användning:
// <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} /> så kapslar in sidorna vi vill ha säkerhet på.
//bör bytas ut för mer säkerhet mot backend lösning men till demot duger denna


import React from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Skyddar route om ingen användare finns i localStorage
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
