import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import PasscodePage from "./PasscodePage";
import BirthdayPage from "./BirthdayPage";
import CelebrationPage from "./CelebrationPage"
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/passcode" element={<PasscodePage />} />
      <Route path="/birthday" element={<BirthdayPage />} />
      <Route path="/celebration" element={<CelebrationPage />} />
    </Routes>
  </BrowserRouter>
);