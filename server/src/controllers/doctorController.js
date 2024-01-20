const Doctor = require("../model/doctorSchema");
const Appointment = require("../model/appointmentSchema");
const Patient = require("../model/patientSchema");
//const Classroom = require("../model/classroomSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mail = require("../modules/mail");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const signUp = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const doctor = new Doctor({ name, email, username, password });

    const token = jwt.sign(
      { email: email, role: "doctor" },
      process.env.secret
    );
    doctor.tokens = doctor.tokens.concat({ token: token });
    await doctor.save();

    const verificationLink = `http://localhost:5000/doctor/verify/${token}`;
    await mail({
      from: process.env.email,
      to: email,
      subject: "Email verification",
      text: `Please click on the following link to verify your email: ${verificationLink}`,
    });

    res.json({ msg: "doctor created successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const sendForgetPasswordEmail = async (req, res) => {
  try {
    const {email} = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ err: "Email not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    doctor.resetPasswordToken = resetToken;
    doctor.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await doctor.save();

    const resetLink = `http://localhost:3000/reset-password/doctor/${resetToken}`;
    
    await mail({
      from: process.env.email,
      to: email,
      subject: "Password Reset Link",
      text: `Please click on the following link to reset Password: ${resetLink}`,
    });

    res.status(200).json({ message: "Sending Email...." });

  } catch (err) {
    console.error("Error in forgot password route:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
   try {
    const { token } = req.params;
    const { password } = req.body;

    const doctor = await Doctor.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Set new password
    doctor.password = password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpires = undefined;

    await doctor.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password route:", error);
    res.status(500).json({ error: "Internal server error" });
  } 
};


const login = async (req, res) => {
  const doctor = req.user;

  const token = jwt.sign(
    { email: doctor.email, role: "doctor" },
    process.env.secret
  );
  doctor.tokens = doctor.tokens.concat({ token: token });

  await doctor.save();
  res.cookie("token", token);

  res.json({ token: token, doctor: doctor });
};

const emailVerification = (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      res.status(400).json({ msg: "Invalid token" });
    } else {
      Doctor.findOne({ email: decoded.email }).then((doctor) => {
        doctor.isVerified = true;
        doctor.save();
        res.redirect(
          `http://localhost:3000/verify/doctor/${doctor.isVerified}`
        );
      });
    }
  });
};

const userPanel = async (req, res) => {
  try {
    const doctor = req.user;
    res.json(doctor);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { doctor } = req.body;
    console.log(doctor);
    const { id } = req.user;
    const updation = await Doctor.findByIdAndUpdate(id, doctor, {
      new: true,
    });
    res.json(updation);
  } catch (err) {
    res.status(400).json(err.message);
  }
};
const deleteDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (req.user.email == email) {
      await Doctor.findOneAndDelete({ email: email });
      res.json({ msg: "Doctor deleted successfully" });
    } else {
      res
        .status(400)
        .json({ msg: "You are not authorized to delete the account" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getDoctorCount = async (req, res) => {
  const count = await Doctor.countDocuments();
  return count;
};

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const doctor = await Doctor.findOne({ username: username });
    doctor.isProfileComplete == false
      ? res.status(400).json({ msg: "doctor not found" })
      : res.json(doctor);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const searchDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const result = doctors
    // who have complete profile
        // .filter((obj) => obj.isProfileComplete === true)
      .map((obj) => {
        return {
          name: obj.name,
          username: obj.username,
          profile: obj.profile,
          city: obj.city,
          rating: obj.rating,
          experience: obj.experience.experience,
          subjectType: obj.experience.subjectType,
          subjectLevel: obj.experience.subjectLevel,
          expertise: obj.experience.expertise,
          fee: obj.availability.fee,
          location: obj.availability.location,
        };
      });
    res.json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// const getAppointments = async (req, res) => {
//   try {
//     const { doctor } = req.body;
//     const appointments = await Appointment.find({ doctor: doctor });
//     if (appointments) {
//       const patients = await Patient.find({
//         username: {
//           $in: appointments.map((appointment) => appointment.patient),
//         },
//       });
//       const result = appointments.map((appointment) => {
//         const patient = patients.find(
//           (patient) => patient.username == appointment.patient
//         );
//         return {
//           ...appointment._doc,
//           patient: {
//             // profile: patient.profile,
//             name: patient.name,
//             username: patient.username,
//           },
//         };
//       });
//       result.sort((a, b) => {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       });
//       res.json(result);
//     } else {
//       res.status(400).json({ msg: "No appointments found" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(err.message);
//   }
// };

const getAppointments = async (req, res) => {
  try {
    const { doctor } = req.body;
    const appointments = await Appointment.find({ doctor: doctor });
    if (appointments) {
      const patients = await Patient.find({
        username: {
          $in: appointments.map((appointment) => appointment.patient),
        },
      });
      const result = appointments.map((appointment) => {
        const patient = patients.find(
          (patient) => patient.username == appointment.patient
        );
        return {
          ...appointment._doc,
          patient: {
            profile: patient.profile,
            name: patient.name,
            username: patient.username,
          },
        };
      });
      result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      res.json(result);
    } else {
      res.status(400).json({ msg: "No appointments found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointment } = req.body;
    const cancellation = await Appointment.findByIdAndUpdate(
      appointment,
      { status: "Cancelled", notes: "Appointment cancelled by doctor" },
      { new: true }
    );
    res.json(cancellation);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const { appointment, link } = req.body;
    const updation = await Appointment.findByIdAndUpdate(
      appointment,
      {
        status: "Accepted",
        notes: `Please join the meeting using the following link: ${link}`,
      },
      { new: true }
    );
    res.json(updation);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function formatTime(timeStr) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm;
}

const modifyAppointment = async (req, res) => {
  try {
    const { appointment, date, time } = req.body;
    console.log(appointment, date, time);
    const updation = await Appointment.findByIdAndUpdate(
      appointment,
      {
        notes: `doctor has requested to modify the appointment to ${formatDate(
          date
        )} at ${formatTime(time)}`,
      },
      { new: true }
    );
    res.json(updation);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// const getClassrooms = async (req, res) => {
//   try {
//     console.log(req.body);
//     const classrooms = await Classroom.find({
//       "doctor.username": req.body.username,
//     });
//     res.status(200).json(classrooms);
//   } catch (err) {
//     res.status(400).json(err.message);
//   }
// };

// const classroomAnnouncement = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { classroom, announcement } = req.body;
//     const update = await Classroom.findByIdAndUpdate(
//       classroom,
//       { $push: { announcements: announcement } },
//       { new: true }
//     );
//     // set announcements in descending order
//     update.announcements.sort((a, b) => {
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//     res.status(200).json(update);
//   } catch (err) {
//     res.status(400).json(err.message);
//   }
// };


module.exports = {
  signUp,
  sendForgetPasswordEmail,
  resetPassword,
  login,
  userPanel,
  emailVerification,
  updateProfile,
  getAllDoctors,
  deleteDoctor,
  getDoctorCount,
  getProfile,
  searchDoctor,
  getAppointments,
  cancelAppointment,
  acceptAppointment,
  modifyAppointment,
};
