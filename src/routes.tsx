// src/routes.tsx

import { Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};