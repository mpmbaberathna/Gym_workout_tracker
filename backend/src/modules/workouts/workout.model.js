const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
    },

    notes: {
      type: String,
    },

    exercises: [
      {
        type: String,
        required: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);