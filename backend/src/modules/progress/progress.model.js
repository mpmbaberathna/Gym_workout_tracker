const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout"
    },
    date: {
      type: Date,
      default: Date.now
    },
    weight: {
      type: Number
    },
    reps: {
      type: Number
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);
