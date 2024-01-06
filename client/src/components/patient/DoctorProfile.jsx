import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../utils/Loader";
import DocProfile from "../utils/DocProfile";
import { useNavigate } from "react-router-dom";
import Alert from "../utils/Alert";
import { io } from "socket.io-client";

const socket = io("");

function DoctorProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState("");
  const [appointment, setAppointment] = useState("");
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  console.log(JSON.parse(localStorage.getItem("patient")).username);

  const [text, setText] = useState({
    text: "",
  });

  const sendMessage = () => {
    const message = {
      participants: [
        {
          username: JSON.parse(localStorage.getItem("patient")).username,
          name: JSON.parse(localStorage.getItem("patient")).name,
          profile: JSON.parse(localStorage.getItem("patient")).profile,
        },
        {
          username: username,
          name: doctor.name,
          profile: doctor.profile,
        },
      ],
      sender: JSON.parse(localStorage.getItem("patient")).username,
      text: text.text,
    };
    socket.emit("newMessage", message);
    setText("");
    setAlert({ type: "success", message: "Message Sent" });
    setTimeout(() => setAlert({ type: "", message: "" }), 5000);
  };

  // const handlePayment = (e) => {
  //   const name = e.target.name;
  //   const value = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setPayment({
  //     ...payment,
  //     fee: doctor.availability.fee,
  //     [name]: value,
  //     totalFee: value.length * doctor.availability.fee,
  //   });
  // };

  async function getDoctor() {
    try {
      setLoading(true);
      const res = await axios.get(`/api/doctor/profile/${username}`);
      console.log("Response of geting doctor is ", res);
      setDoctor(res.data);
      setLoading(false);
    } catch (err) {
      setDoctor("");
      console.log("Error in getting doctor", err);
    }
  }

  // // Redirect to server API GET 'patient/payment'
  // const sendPayment = async () => {
  //   const url = `http://localhost:5000/patient/payment/?fee=${
  //     doctor.availability.fee
  //   }&doctor=${doctor.username}&patient=${
  //     JSON.parse(localStorage.getItem("patient")).username
  //   }&multipleSubjects=${JSON.stringify(payment.multipleSubject)}`;
  //   window.location.href = url;
  // };

  // Redirect to server API GET 'patient/payment'
  const sendPayment = async () => {
    const url = `http://localhost:5000/patient/payment/?fee=${
      doctor.availability.fee
    }&doctor=${doctor.username}&patient=${
      JSON.parse(localStorage.getItem("patient")).username
    }`;
    window.location.href = url;
  };

  // const checkAppointmentSuccess = async (appointmentDetails) => {
  //   // Check if the URL contains the success parameter
  //   setLoading(true);

  //   // const response = await axios.post(
  //   //   "/api/payment/success",
  //   //   appointmentDetails
  //   // );
  //   console.log("checksuccess function is called ");
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.get("paymentSuccess") == "true") {
  //     console.log("yes paymentSuccess is true ");
  //     // Set success alert after successful payment
  //     setAlert({
  //       type: "success",
  //       message: "Appointment sucees is true",
  //     });
  //     window.alert("Appointment created successfully");

  //     // Redirect to the appointment page
  //     (setTimeout) => (navigate("/patient/dashboard/appointments"), 2000);
  //     navigate("/patient/dashboard/appointments");
  //   }
  //   setAlert({
  //     type: "success",
  //     message: "Appointment sucees is true",
  //   });

  //   if (response.data.success) {
  //     navigate("/patient/dashboard/appointments");
  //     console("response.data.success is ", response.data.success);
  //     setAlert({
  //       type: "success",
  //       message: "Appointment created successfully",
  //     });

  //     window.alert("Appointment created successfully");

  //     // Redirect to the appointment page
  //   }

  //   setAlert({
  //     type: "success",
  //     message: "Appointment created successfully",
  //   });
  //   window.alert("Appointment created successfully");
  // };

  const BookAppointment = async () => {
    try {
      setLoading(true);
      const appointmentDetails = { ...appointment };
      appointmentDetails.doctor = doctor.username;
      appointmentDetails.patient = await JSON.parse(
        localStorage.getItem("patient")
      ).username;
      appointmentDetails.appointmentFee = doctor.availability.fee;

      const response = await axios.post(
        "/api/patient/appointment",
        appointmentDetails
      );

      // Redirect to Stripe Checkout page
      setAlert({ type: "success", message: "Redirecting to Payment" });
      setTimeout(() => {
        window.location.href = response.data.stripeCheckoutUrl;
      }, 3000);
      console.log("Stripe session status is", response.data.stripeSession);

      setLoading(false);
    } catch (error) {
      console.error("Error initiating payment:", error);
      // Handle error and set appropriate alerts
      setLoading(false);
    }
  };

  const handleChanges = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <>
      {loading && <Loader loading={loading} />}
      {doctor == null ? (
        <div
          className="d-flex justify-content-center align-items-center bg-light my-3 rounded-3"
          style={{ height: "85vh" }}
        >
          <h1>Doctor Not Found</h1>
        </div>
      ) : (
        doctor && <DocProfile doctor={doctor} myself={false} />
      )}

      <div
        className="modal fade"
        id="set-appointment"
        tabindex="-1"
        aria-labelledby="set-appointmentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Arrange Appointment</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                data-toggle="modal"
                data-target="#set-appointment"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row justify-content-center">
                  <div className="row">
                    <div className="col-6">
                      <div class="form-group">
                        <label for="MeetingDate" class="form-label">
                          Date
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          id="MeetingDate"
                          placeholder="Enter Date"
                          name="appointmentDate"
                          value={appointment.appointmentDate}
                          onChange={handleChanges}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div class="form-group">
                        <label for="MeetingTime" class="form-label">
                          Time
                        </label>
                        <input
                          type="time"
                          class="form-control"
                          id="MeetingTime"
                          placeholder="Enter Time"
                          name="appointmentTime"
                          value={appointment.appointmentTime}
                          onChange={handleChanges}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div class="form-group">
                      <label for="duration" class="form-label mt-4">
                        Meeting duration (minutes)
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        id="duration"
                        placeholder="How much will it take?"
                        name="duration"
                        value={appointment.duration}
                        onChange={handleChanges}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div class="form-group">
                      <label for="MeetingDescription" class="form-label mt-4">
                        What's the purpose of Appointment?
                      </label>
                      <textarea
                        class="form-control"
                        id="MeetingDescription"
                        rows="3"
                        name="notes"
                        value={appointment.notes}
                        onChange={handleChanges}
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      class="btn btn-primary mt-4 w-75"
                      data-dismiss="modal"
                      onClick={BookAppointment}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="modal fade"
        id="payment"
        tabIndex="-1"
        aria-labelledby="paymentLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Checkout</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                data-toggle="modal"
                data-target="#payment"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row justify-content-center">
                  <div className="row">
                    <div className="form-group">
                      <label htmlFor="fee" className="form-label">
                        Fee per subject
                      </label>
                      <input
                        disabled
                        type="text"
                        className="form-control"
                        id="fee"
                        placeholder="Amount"
                        name="fee"
                        value={doctor && doctor.availability.fee}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group">
                      <label
                        htmlFor="MultipleSubject"
                        className="form-label mt-4"
                      >
                        Select subjects that you want to learn
                      </label>
                      <select
                        multiple
                        className="form-select"
                        id="MultipleSubject"
                        name="multipleSubject"
                        value={payment.multipleSubject}
                        onChange={handlePayment}
                      >
                        <option>Choose...</option>
                        <option value="Islamic Studies">Islamic Studies</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Science">
                          Science (Physics, Chemistry)
                        </option>
                        <option value="Math">Math</option>
                        <option value="Urdu">Urdu</option>
                        <option value="English">English</option>
                        <option value="Computer">Computer</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="bg-light p-4 rounded-3">
                      <h5 className="mb-2">Payment Summary</h5>
                      <div className="row justify-content-center my-3">
                        <div className="col-5">
                          <p className="mb-0">Fee per subject</p>
                        </div>
                        <div className="col-5 text-end">
                          <p className="mb-0">
                            {doctor && doctor.availability.fee}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary mt-4 w-75"
                      onClick={sendPayment}
                    >
                      Go to Checkout
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      <div
        className="modal fade"
        id="message"
        tabindex="-1"
        aria-labelledby="messageLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Send Message</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                data-toggle="modal"
                data-target="#message"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row justify-content-center">
                  <div className="row">
                    <div class="form-group">
                      <label for="MeetingDescription" class="form-label">
                        Write your message below
                      </label>
                      <textarea
                        class="form-control"
                        id="MeetingDescription"
                        rows="3"
                        name="text"
                        value={setText.text}
                        onChange={(e) =>
                          setText({ ...setText, text: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      class="btn btn-primary mt-4 w-75"
                      data-dismiss="modal"
                      onClick={sendMessage}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {alert.message ? <Alert type={alert.type} message={alert.message} /> : ""}
    </>
  );
}

export default DoctorProfile;
