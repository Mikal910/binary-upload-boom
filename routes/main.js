const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");

const profileController = require("../controllers/profile"); // Profile Controller
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Main Routes
router.get("/", homeController.getindex);
router.get("/profile", ensureAuth, profileController.getProfile); // Profile Page
router.post("/profile", ensureAuth, profileController.saveProfile); // Save Profile
router.put("/profile/update/:id", ensureAuth, profileController.updateProfile); // Update Profile

router.get("/login", authController.getLogin); // Login Page
router.post("/login", authController.postLogin); // Login Action
router.get("/logout", authController.logout); // Logout Action
router.get("/signup", authController.getSignup); // Signup Page
router.post("/signup", authController.postSignup); // Signup Action
router.get("/home", ensureAuth, profileController.getHome); // Home Page
router.get("/myexercise", ensureAuth, profileController.getMyExercise); // Display Saved Workouts
router.delete("/deleteworkout/:id", ensureAuth, profileController.deleteWorkout); // Delete Workout
router.put("/saveworkout", ensureAuth, profileController.saveWorkout); // Save Workout

module.exports = router;
