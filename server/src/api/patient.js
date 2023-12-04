const express = require("express");
const router = express.Router();
const Classroom = require("./../model/classroomSchema");
const Doctor = require("./../model/doctorSchema");
const Patient = require("./../model/patientSchema");
const Appointment = require("./../model/appointmentSchema");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./src/public/uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

const {
  signUp,
  login,
  userPanel,
  emailVerification,
  getAllPatients,
  getPatientCount,
  deletePatient,
  updatePatient,
  appointment,
  saveAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  payment,
  getClassrooms,
  getClass,
  uploadAssignment,
  uploadQuiz,
} = require("../controllers/patientController");
const { Register, Login } = require("../middleware/basic");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
// const passport = require("../middleware/googleAuth");

router.post("/patient/signup", Register, signUp);
router.post("/patient/login", Login, login);
router.post("/patient/details", auth, userPanel);
// As I click on Email Verification link, This route will execute
router.get("/patient/verify/:token", emailVerification);

router.post("/patient/appointment", appointment);
router.post("/patient/appointment/get", getAppointments);
router.post("/patient/appointment/delete", deleteAppointment);
router.post("/patient/appointment/update", updateAppointment);

router.get("/patient/all", getAllPatients);
router.get("/patient/count", getPatientCount);
router.post("/patient/delete", auth, deletePatient);
router.post("/patient/update", auth, updatePatient);

router.post("/patient/getclassrooms", getClassrooms);
router.get("/patient/getclass/:id", getClass);
router.post(
  "/patient/upload/assignment",
  upload.single("content"),
  uploadAssignment
);
router.post("/patient/upload/quiz", upload.single("content"), uploadQuiz);

// For signUp with Google
//passport.authenticate is middleware, transfer control to passport(That inside the googleAuth.js) middleware

router.get(
  "/patient/createGoogle",
  passport.authenticate("patient", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/patient/callback",
  passport.authenticate("patient", { failureRedirect: "/patient/signup" }),
  (req, res) => {
    res.redirect(
      "http://localhost:3000/patient/dashboard?token=" +
        req.user.tokens[req.user.tokens.length - 1].token
    );
  }
);

// For login with Google
router.get(
  "/patient/useGoogle",
  passport.authenticate("patient", { scope: ["profile", "email"] })
);

//Google Auth 2.0 run this(Call Back) route automatically
router.get(
  "/auth/google/patient/callback",
  passport.authenticate("patient", {
    failureRedirect: "/patient/login",
    successFlash: "Welcome!",
  }),
  (req, res) => {
    res.redirect(
      "http://localhost:3000/patient/dashboard?token=" +
        req.user.tokens[req.user.tokens.length - 1].token
    );
  }
);

// const saveData = async (req, res, next) => {
//   const multipleSubjects = req.query.multipleSubjects.split(",");
//   const subjects = multipleSubjects.map((subject) => ({ name: subject }));

//   const count = await Classroom.countDocuments();
//   const result = await Doctor.findOne({ username: req.query.doctor });
//   const result2 = await Patient.findOne({ username: req.query.patient });

//   const data = {
//     name: `Classroom ${count + 1}`,
//     doctor: {
//       name: result.name,
//       username: result.username,
//       profile: result.profile,
//     },
//     patient: {
//       name: result2.name,
//       username: result2.username,
//       profile: result2.profile,
//     },
//     subjects: subjects,
//     schedule: {
//       startTime: result.availability.startDate,
//       endTime: result.availability.endDate,
//     },
//   };

//   const classroom = new Classroom(data);
//   await classroom.save();
//   next();
// };

// This API will auto run on click payment check out
// router.get("/patient/payment/", payment);

// router.get("/payment/success", (req, res) => {
//   console.log("Try Success");
//   console.log("Try Success response is ", res);
//   res.redirect("http://localhost:3000/patient/dashboard/appointments");

//   // console.log("Error in redirecting to appointment page ", error);

//   console.log("Payment Success API run, redirected to appointments page");
// });

// router.get("/patient/appointment/success", (req, res) => {
//   // Logic to determine success
//   // For simplicity, you can just send a success response
//   res.status(200).json({ success: true, msg: "Appointment success" });
// });

// Handle payment success

// router.get("/payment/success", async (req, res) => {
//   try {
//     // Retrieve necessary data from the query parameters
//     console.log("query data is ", req.query);
//     const { appointmentDate, appointmentTime, notes, doctor, patient } =
//       req.query;

//     console.log("body data is ", req.body);
//     // const { appointmentDate, appointmentTime, notes, doctor, patient } =
//     //   req.body;

//     console.log("Appointment response data is ", doctor, patient);

//     // Save the appointment details to the database
//     const appointment = new Appointment({
//       appointmentDate,
//       appointmentTime,
//       notes,
//       doctor,
//       patient,
//     });
//     console.log("Appointment response data is ", appointment);
//     const savedAppointment = await appointment.save();

//     // Perform other actions as needed
//     // ...

//     res.redirect(
//       `${req.headers.origin}/patient/dashboard/appointments?paymentSuccess=true`
//     );
//   } catch (error) {
//     console.error("Error handling payment success:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/payment/success", async (req, res) => {
  // const appointmentData = req.query.appointmentData;
  // const {
  //   appointmentDate,
  //   appointmentTime,
  //   notes,
  //   doctor,
  //   patient,
  //   appointmentFee,
  // } = req.query;

  const { appointmentData } = req.query;
  const {
    appointmentDate,
    appointmentTime,
    notes,
    doctor,
    patient,
    appointmentFee,
  } = JSON.parse(decodeURIComponent(appointmentData));

  console.log("succes url runing");

  console.log(
    "Appointment data is",
    appointmentDate,
    appointmentTime,
    notes,
    doctor,
    patient,
    appointmentFee
  );

  const appointmentSave = new Appointment({
    appointmentDate,
    appointmentTime,
    notes,
    doctor,
    patient,
  });
  const savedAppointment = await appointmentSave.save();

  console.log("Appointment saved in db ", savedAppointment);

  res.redirect("http://localhost:3000/patient/dashboard/appointments");
});

// router.post("/payment/success", saveAppointment);

// router.get("/payment/success", (req, res) => {
//   console.log("Payment Success API run, redirected to appointments");
//   res.redirect(
//     "http://localhost:3000/patient/dashboard/appointments?paymentSuccess=true"
//   );
// });
//localhost:3000/patient/dashboard

router.get("/payment/cancel", (req, res) => {
  try {
    res.redirect("http://localhost:3000/patient/dashboard?payment=cancel");
  } catch (error) {
    console.log("Error in redirecting ", error);
  }
  console.log("Cancel Api runed");
});

module.exports = router;
