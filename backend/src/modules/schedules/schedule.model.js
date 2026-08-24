const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);