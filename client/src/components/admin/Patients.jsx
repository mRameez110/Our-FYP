import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchPatients = async () => {
    setLoading(true);
    const res = await axios.get("/api/patient/all");
    setPatients(res.data);
    setLoading(false);
  };

  const deletePatient = async (e) => {
    try {
      setLoading(true);
      const { id } = e.target.parentNode.parentNode.childNodes[0];
      await axios.delete(`/api/admin/patient/delete/${id}`);
      setPatients(patients.filter((patient) => patient._id !== id));
      setLoading(false);
      setAlert({ type: "success", message: "Patient deleted successfully" });
      setTimeout(function () {
        setAlert({ type: "", message: "" });
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };

  const searchPatient = async (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      setPatients(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      fetchPatients();
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <h1 className="display-4 mt-2 mb-5 text-center">Patients</h1>
      <div className="d-flex justify-content-end align-items-center">
        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createPatient">Add Patient</button> */}
        <form className="d-flex">
          <input
            className="form-control me-sm-2"
            type="search"
            placeholder="Search patient name"
            name="search"
            onChange={searchPatient}
            aria-label="Search"
          />
          <button className="btn btn-dark my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </div>
      <hr />
      <table class="table table-hover align-middle">
        <thead>
          <tr class="table-dark text-center">
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Patientname</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <Loader /> : ""}
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <tr key={patient._id} class="table-secondary text-center">
                <th id={patient._id} scope="row">
                  {index + 1}
                </th>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.username}</td>
                <td>
                  {/* <button type="button" class="mx-2 btn btn-warning" data-toggle="modal" data-target="#updatePatient">Update</button> */}
                  <button
                    type="button"
                    class="mx-2 btn btn-danger"
                    onClick={deletePatient}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr class="table-secondary text-center">
              <td colSpan="5">No patients found</td>
            </tr>
          )}
        </tbody>
        {alert.message ? (
          <Alert type={alert.type} message={alert.message} />
        ) : (
          ""
        )}
      </table>
    </div>
  );
}

export default Patients;
