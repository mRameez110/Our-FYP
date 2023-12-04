const express = require("express");
const router = express.Router();
const passport = require("passport");
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
  updateProfile,
  getAllDoctors,
  getProfile,
  searchDoctor,
  getAppointments,
  cancelAppointment,
  acceptAppointment,
  modifyAppointment,
  getClassrooms,
  classroomAnnouncement,
  classroomNotes,
  classroomAssignments,
  classroomQuizzes,
  deleteDoctor,
} = require("../controllers/doctorController");
const { Register, Login } = require("../middleware/basic");
const auth = require("../middleware/auth");

router.post("/doctor/signup", Register, signUp);
router.post("/doctor/login", Login, login);
router.post("/doctor/details", auth, userPanel);
router.get("/doctor/verify/:token", emailVerification);
router.post("/doctor/delete", auth, deleteDoctor);

router.get("/doctor/search", searchDoctor);

router.post("/doctor/appointment/get", getAppointments);
router.post("/doctor/appointment/cancel", cancelAppointment);
router.post("/doctor/appointment/accept", acceptAppointment);
router.post("/doctor/appointment/modify", modifyAppointment);

router.get("/doctor/profile/:username", getProfile);
router.get("/doctor/all", getAllDoctors);
router.post("/doctor/update", auth, updateProfile);

router.post("/doctor/getclassrooms", getClassrooms);
router.post("/doctor/classroom/update", classroomAnnouncement);
router.post(
  "/doctor/classroom/notes",
  upload.single("content"),
  classroomNotes
);
router.post(
  "/doctor/classroom/assignment",
  upload.single("content"),
  classroomAssignments
);
router.post(
  "/doctor/classroom/quiz",
  upload.single("content"),
  classroomQuizzes
);

router.get(
  "/doctor/createGoogle",
  passport.authenticate("doctor", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/doctor/callback",
  passport.authenticate("doctor", { failureRedirect: "/doctor/login" }),
  (req, res) => {
    res.redirect(
      "http://localhost:3000/doctor/dashboard?token=" +
        req.user.tokens[req.user.tokens.length - 1].token
    );
  }
);

router.get(
  "/doctor/useGoogle",
  passport.authenticate("doctor", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/doctor/callback",
  passport.authenticate("doctor", { failureRedirect: "/doctor/signup" }),
  (req, res) => {
    res.redirect(
      "http://localhost:3000/doctor/dashboard?token=" +
        req.user.tokens[req.user.tokens.length - 1].token
    );
  }
);

module.exports = router;
