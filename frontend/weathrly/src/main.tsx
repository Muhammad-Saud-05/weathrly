import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import MainLayout from "./layouts/MainLayout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);