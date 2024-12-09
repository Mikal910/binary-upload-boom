const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Height: {
    type: String,
    required: true, 
  },
  Weight: {
    type: String,
    required: true, 
  },
  BodyType: {
    type: String,
    required: true,
  },
  WorkoutType: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  savedWorkouts: [
    {
      name: { type: String, required: true },
      type: { type: String },
      bodytype: { type: String }, 
      muscle: { type: String },
      equipment: { type: String },
      difficulty: { type: String },
      instructions: { type: [String] },
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);

