const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Patient = require("../model/patientSchema");
const Doctor = require("../model/doctorSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const patient = {
  // clientID:
  //   "105385184117-ht1e2jr8p5j31nj53bdiubgg3s68t0o9.apps.googleusercontent.com",
  // clientSecret: "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",

  clientID:
    "143413884379-p0gmd49m0k4j4759rcsj088nspq43t75.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:5000/auth/google/patient/callback",
};

const doctor = {
  // clientID:
  //   "105385184117-ht1e2jr8p5j31nj53bdiubgg3s68t0o9.apps.googleusercontent.com",
  // clientSecret: "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",
  clientID:
    "143413884379-p0gmd49m0k4j4759rcsj088nspq43t75.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:5000/auth/google/doctor/callback",
};

function generateUsername(email) {
  const emailPrefix = email.split("@")[0];
  const alphanumericPrefix = emailPrefix.replace(/[^a-zA-Z0-9]/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const username = alphanumericPrefix + randomSuffix;
  return username;
}
// GoogleStrategy Configuration
passport.use(
  "patient",
  new GoogleStrategy(
    patient,
    async (accessToken, refreshToken, profile, done) => {
      const find = await Patient.findOne({ email: profile.emails[0].value });
      if (find) return done(null, find);
      const user = new Patient({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: generateUsername(profile.emails[0].value),
        password: profile.id,
        isVerified: profile.emails[0].verified,
        role: "patient",
        profile: profile.photos[0].value,
      });
      const token = jwt.sign(
        { email: profile.emails[0].value, role: "patient" },
        process.env.secret
      );
      user.tokens = user.tokens.concat({ token: token });
      await user.save();
      done(null, user);
    }
  )
);

passport.use(
  "doctor",
  new GoogleStrategy(
    doctor,
    async (accessToken, refreshToken, profile, done) => {
      const find = await Doctor.findOne({ email: profile.emails[0].value });
      if (find) return done(null, find);
      console.log(profile);
      const user = new Doctor({
        name: profile.displayName,
        email: profile.emails[0].value,
        username: generateUsername(profile.emails[0].value),
        password: profile.id,
        isVerified: profile.emails[0].verified,
        role: "doctor",
        profile: profile.photos[0].value,
      });
      const token = jwt.sign(
        { email: profile.emails[0].value, role: "doctor" },
        process.env.secret
      );
      user.tokens = user.tokens.concat({ token: token });
      await user.save();
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
