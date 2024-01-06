import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import DoctorNavbar from "./DoctorNavbar";
import Statistics from "./Statistics";
import EditProfile from "./EditProfile";
import DeleteProfile from "./DeleteProfile";
import ViewProfile from "./ViewProfile";
import Classrooms from "./Classrooms";
import Class from "./Class";
import Messages from "./Messages";
import Appointments from "./Appointments";

function DoctorDashoard() {
  const [doctor, setDoctor] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  async function getDoctor() {
    try {
      if (localStorage.getItem("token")) {
        const res = await axios.post("/api/doctor/details", {
          token: localStorage.getItem("token"),
        });
        console.log(res);
        setDoctor(res.data);
        localStorage.setItem("doctor", JSON.stringify(res.data));
      } else {
        const res = await axios.post("/api/doctor/details", { token });
        console.log(res);
        setDoctor(res.data);
        localStorage.setItem("token", token);
        localStorage.setItem("doctor", JSON.stringify(res.data));
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }

  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <>
      <DoctorNavbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Statistics doctor={doctor} />} />
          <Route
            path="/edit-profile"
            element={<EditProfile doctor={doctor} />}
          />
          <Route
            path="/view-profile"
            element={<ViewProfile doctor={doctor} />}
          />
          <Route path="/delete-profile" element={<DeleteProfile />} />
          {/* <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/class/:id" element={<Class />} /> */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </>
  );
}

export default DoctorDashoard;
