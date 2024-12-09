const User = require("../models/User"); // Example user model
const workoutjs = require("../public/workout");
const Post = require("../models/Post"); // Use Post model for saved workouts

module.exports = {
    getMyExercise: async (req, res) => {
        try {
            const post = await Post.findOne({ user: req.user.id }).lean();
            const workouts = post ? post.savedWorkouts : []; // Get saved workouts

            // Group workouts by muscle type
            const groupedWorkouts = workouts.reduce((groups, workout) => {
                let group = "";
                if (["abdominals", "obliques"].includes(workout.muscle)) {
                    group = "Abs";
                } else if (["biceps", "triceps", "forearms"].includes(workout.muscle)) {
                    group = "Arms";
                } else if (["quadriceps", "hamstrings", "calves", "glutes"].includes(workout.muscle)) {
                    group = "Legs";
                } else if (["chest", "lats", "middle_back", "lower_back"].includes(workout.muscle)) {
                    group = "Chest & Back";
                } else if (["shoulders", "traps"].includes(workout.muscle)) {
                    group = "Shoulders";
                } else {
                    group = "Others";
                }

                if (!groups[group]) groups[group] = [];
                groups[group].push(workout);
                return groups;
            }, {});

            res.render("myexercise", { groupedWorkouts }); // Pass grouped workouts to the EJS file
        } catch (err) {
            console.error("Error fetching saved workouts:", err);
            res.redirect("/profile");
        }
    },

    saveWorkout: async (req, res) => {
        try {
            const { name } = req.body;

            // Find the user's saved workouts
            const post = await Post.findOne({ user: req.user.id });

            // Check if the workout is already saved
            if (post && post.savedWorkouts.some(workout => workout.name === name)) {
                return res.status(400).json({ success: false, message: "Workout already saved" });
            }

            // Save the workout
            await Post.findOneAndUpdate(
                { user: req.user.id },
                { $push: { savedWorkouts: req.body } },
                { new: true, upsert: true }
            );

            console.log("Workout saved successfully!");
            res.json({ success: true, message: "Workout saved successfully!" });
        } catch (err) {
            console.error("Error saving workout:", err);
            res.status(500).json({ success: false, message: "Failed to save workout." });
        }
    },

    deleteWorkout: async (req, res) => {
        try {
            const { id } = req.params;
            await Post.findOneAndUpdate(
                { user: req.user.id },
                { $pull: { savedWorkouts: { _id: id } } }
            );
            res.json({ success: true, message: "Workout deleted successfully" });
        } catch (err) {
            console.error("Error deleting workout:", err);
            res.status(500).json({ success: false, message: "Failed to delete workout" });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).lean();
            res.render("profile", { user });
        } catch (err) {
            console.error("Error fetching profile:", err);
            res.redirect("/feed");
        }
    },

    getHome: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).lean();
            res.render("home", { user, workouts: workoutjs });
        } catch (err) {
            console.error("Error loading home page:", err);
            res.redirect("/feed");
        }
    },

    saveProfile: async (req, res) => {
        try {
            const { name, height, weight, bodyType, workoutType, weightGoal } = req.body;

            await User.findByIdAndUpdate(req.user.id, {
                name,
                height,
                weight,
                bodyType,
                workoutType,
                weightGoal,
            });

            console.log("Profile saved successfully!");
            res.redirect("/home");
        } catch (err) {
            console.error("Error saving profile:", err);
            res.status(500).json({ success: false, message: "Failed to save profile" });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { name, height, weight, bodyType, workoutType, weightGoal } = req.body;
    
            // Update user details in the database
            await User.findByIdAndUpdate(req.user.id, {
                name,
                height,
                weight,
                bodyType,
                workoutType,
                weightGoal,
            });
    
            console.log("Profile updated successfully!");
            res.redirect("/profile"); // Redirect back to the profile page
        } catch (err) {
            console.error("Error updating profile:", err);
            res.status(500).json({ success: false, message: "Failed to update profile" });
        }
    }
    
};
