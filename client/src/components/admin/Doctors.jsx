import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchDoctors = async () => {
    setLoading(true);
    const res = await axios.get("/api/doctor/all");
    setDoctors(res.data);
    console.log(res.data);
    setLoading(false);
  };

  const deleteDoctor = async (e) => {
    try {
      setLoading(true);
      const { id } = e.target.parentNode.parentNode.childNodes[0];
      await axios.delete(`/api/admin/doctor/delete/${id}`);
      setDoctors(doctors.filter((doctor) => doctor._id !== id));
      setLoading(false);
      setAlert({ type: "success", message: "Doctor deleted successfully" });
      setTimeout(function () {
        setAlert({ type: "", message: "" });
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };

  const searchDoctor = async (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      setDoctors(
        doctors.filter((doctor) =>
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      fetchDoctors();
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div>
      <h1 className="display-4 mt-2 mb-5 text-center">Doctors</h1>
      <div className="d-flex justify-content-end align-items-center">
        {/* <button type="button" className="btn btn-primary">Add Doctor</button> */}
        <form className="d-flex">
          <input
            className="form-control me-sm-2"
            type="search"
            placeholder="Enter doctor name"
            onChange={searchDoctor}
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
            <th scope="col">Username</th>
            <th scope="col">Contact No</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <Loader /> : ""}
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={doctor._id} class="table-secondary text-center">
                <th id={doctor._id} scope="row">
                  {index + 1}
                </th>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.username}</td>
                <td>{doctor.contactno}</td>
                <td>
                  {/* <button type="button" class="mx-2 btn btn-warning">Update</button> */}
                  <button
                    type="button"
                    class="mx-2 btn btn-danger"
                    onClick={deleteDoctor}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr class="table-secondary text-center">
              <td colSpan="5">No doctor found</td>
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

export default Doctors;
