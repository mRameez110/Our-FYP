const express = require("express");
const router = express.Router();
// const Classroom = require("./../model/classroomSchema");
const Doctor = require("./../model/doctorSchema");
const Patient = require("./../model/patientSchema");
const Appointment = require("./../model/appointmentSchema");
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: "./src/public/uploads/",
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
//   },
// });

// const upload = multer({ storage });

const {
  signUp,
  sendForgetPasswordEmail,
  resetPassword,
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
  
  codeGenerator,
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

router.post("/patient/forget-password", sendForgetPasswordEmail);
router.post("/patient/reset-password/:token", resetPassword);

router.post("/patient/appointment", appointment);
router.post("/patient/appointment/get", getAppointments);
router.post("/patient/appointment/delete", deleteAppointment);
router.post("/patient/appointment/update", updateAppointment);

router.get("/patient/all", getAllPatients);
router.get("/patient/count", getPatientCount);
router.post("/patient/delete", auth, deletePatient);
router.post("/patient/update", auth, updatePatient);
router.post("/patient/referral-code", auth, codeGenerator);

// router.post("/patient/getclassrooms", getClassrooms);
// router.get("/patient/getclass/:id", getClass);
// router.post(
//   "/patient/upload/assignment",
//   upload.single("content"),
//   uploadAssignment
// );
// router.post("/patient/upload/quiz", upload.single("content"), uploadQuiz);

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
    duration,
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
    duration,
    notes,
    doctor,
    patient,
    appointmentFee
  );

  const appointmentSave = new Appointment({
    appointmentDate,
    appointmentTime,
    duration,
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
