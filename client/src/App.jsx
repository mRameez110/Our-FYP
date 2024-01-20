import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./components/main/Home";
import Login from "./components/main/Login";
import AdminLogin from "./components/main/AdminLogin";
import Signup from "./components/main/Signup";
import Verifier from "./components/main/Verifier";
import ForgetPassword from "./components/main/ForgetPassword";
import ResetPassword from "./components/main/ResetPassword";

import PatientDashboard from "./components/patient/PatientDashoard";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("I found the token in App.js file");
      if (localStorage.getItem("patient")) {
        navigate("/patient/dashboard");
      } else if (localStorage.getItem("doctor")) {
        navigate("/doctor/dashboard");
      } else if (localStorage.getItem("admin")) {
        console.log("admin");
      } else {
        console.log();
      }
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/verify/:role/:status" element={<Verifier />} />
        <Route path="/forgot-password/:role" element={<ForgetPassword />} />
        <Route path="/reset-password/:role/:token" element={<ResetPassword />} />

        <Route path="/patient/dashboard/*" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard/*" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
