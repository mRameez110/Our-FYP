import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import Home from "./components/main/Home";
import Login from "./components/main/Login";
import AdminLogin from "./components/main/AdminLogin";
import Signup from "./components/main/Signup";
import Verifier from "./components/main/Verifier";

import PatientDashboard from "./components/patient/PatientDashoard";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("patient")) {
        navigate("/patient/dashboard/finder");
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

        <Route path="/patient/dashboard/*" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard/*" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
