import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import PatientNavbar from "./PatientNavbar";
import Statistics from "./Statistics";
import Finder from "./Finder";
// import Classrooms from "./Classrooms";
// import Class from "./Class";
import Messages from "./Messages";
import Appointments from "./Appointments";

import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import ReferralPage from "./ReferralPage";
import DeleteProfile from "./DeleteProfile";
import DoctorProfile from "./DoctorProfile";

function PatientDashoard() {
  const [patient, setPatient] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // In case of login with Google Authentication, need to get token from url.
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  async function getPatient() {
    try {
      //If case: When Sign in using form
      if (localStorage.getItem("token")) {
        const res = await axios.post("/api/patient/details", {
          token: localStorage.getItem("token"),
        });
        setPatient(res.data);
        localStorage.setItem("patient", JSON.stringify(res.data));
        console.log("Setted patient response is ", res.data);
      }
      // When Sign in Using Google Auth
      else {
        const res = await axios.post("/api/patient/details", { token });
        setPatient(res.data);
        localStorage.setItem("patient", JSON.stringify(res.data));
        localStorage.setItem("token", token);
        console.log("Setted patient response 2 is ", res.data);
      }
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }

  useEffect(() => {
    getPatient();
  }, []);

  return (
    <>
      <PatientNavbar patient={patient} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Statistics patient={patient} />} />
          <Route path="/finder" element={<Finder />} />
          {/* <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/class/:id" element={<Class />} /> */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/profile/:username" element={<DoctorProfile />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/delete-profile" element={<DeleteProfile />} />
        </Routes>
      </div>
    </>
  );
}

export default PatientDashoard;
