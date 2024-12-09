const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const workoutinfo = require("../public/workout");

module.exports = {
  // Fetch saved workouts for the user
  getSavedWorkouts: async (req, res) => {
    try {
      const post = await Post.findOne({ user: req.user.id }).lean();
      const savedWorkouts = post ? post.savedWorkouts : [];
      res.render("myexercise.ejs", { workouts: savedWorkouts, user: req.user });
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  },

  // Save a workout to the user's savedWorkouts
  saveWorkout: async (req, res) => {
    try {
      const { name, type, bodytype, muscle, equipment, difficulty, instructions } = req.body;

      await Post.findOneAndUpdate(
        { user: req.user.id },
        {
          $push: {
            savedWorkouts: {
              name,
              type,
              bodytype,
              muscle,
              equipment,
              difficulty,
              instructions,
            },
          },
        },
        { new: true, upsert: true } // Create document if it doesn't exist
      );

      console.log("Workout saved!");
      res.json({ success: true, message: "Workout saved successfully!" });
    } catch (err) {
      console.error("Error saving workout:", err);
      res.status(500).json({ success: false, message: "Failed to save workout." });
    }
  },

  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user, workouts: workoutinfo });
    } catch (err) {
      console.log(err);
    }
  },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createPost: async (req, res) => {
    try {
      let profile = await Post.create({
        Name: req.body.name,
        Height: req.body.height,
        Weight: req.body.weight,
        BodyType: req.body.bodytype,
        WorkoutType: req.body.workouttype,
        user: req.user.id,
      });

      profile.save();
      console.log("Post has been added!");
      res.redirect("/home");
    } catch (err) {
      console.log(err);
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
