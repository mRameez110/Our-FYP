const express = require("express");
const router = express.Router();

const {
  login,
  deletePatient,
  deleteDoctor,
  sendEmail,
} = require("../controllers/adminController");
const { getPatientCount } = require("../controllers/patientController");
const { getDoctorCount } = require("../controllers/doctorController");
const { getContactCount } = require("../controllers/contactController");
const Appointment = require("./../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const auth = require("../middleware/auth");

// count doctors by city

router.post("/admin/message/send", sendEmail);

router.post("/admin/login", login);

router.get("/admin/statistics", async (req, res) => {
  try {
    const patientCount = await getPatientCount();
    const doctorCount = await getDoctorCount();
    const contactCount = await getContactCount();
    const appointmentCount = await Appointment.countDocuments();
    const doctors = await Doctor.find();
    const city = cityStat(doctors);
    const completion = completionStat(doctors);
    const gender = genderStat(doctors);
    const rate = rating(doctors);
    res.json({
      patientCount,
      doctorCount,
      contactCount,
      appointmentCount,
      city,
      completion,
      gender,
      rate,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json(err.message);
  }
});

const completionStat = (doctors) => {
  const completion = doctors.reduce(
    (acc, curr) => {
      if (curr.isProfileComplete) {
        acc.completed++;
      } else {
        acc.notCompleted++;
      }
      return acc;
    },
    { completed: 0, notCompleted: 0 }
  );
  return completion;
};

const genderStat = (doctors) => {
  const gender = doctors.reduce(
    (acc, curr) => {
      if (curr.gender === "Male") {
        acc.male++;
      } else {
        acc.female++;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );
  return gender;
};

const cityStat = (doctors) => {
  const city = doctors.reduce((acc, curr) => {
    const city = curr.city;
    const index = acc.findIndex((item) => item.city === city);
    if (index === -1) {
      acc.push({ city, count: 1 });
    } else {
      acc[index].count++;
    }
    return acc;
  }, []);
  return city;
};

const rating = (doctors) => {
  const rating = doctors.reduce(
    (acc, curr) => {
      const rating = curr.rating;
      if (rating >= 4.5) {
        acc.fourHalf++;
      } else if (rating >= 4) {
        acc.four++;
      } else if (rating >= 3) {
        acc.three++;
      } else if (rating >= 2) {
        acc.two++;
      } else if (rating >= 1) {
        acc.one++;
      } else {
        acc.zero++;
      }
      return acc;
    },
    { fourHalf: 0, four: 0, three: 0, two: 0, one: 0, zero: 0 }
  );
  return rating;
};

router.get("/appointment/all", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.delete("/admin/patient/delete/:id", deletePatient);
router.delete("/admin/doctor/delete/:id", deleteDoctor);

module.exports = router;
