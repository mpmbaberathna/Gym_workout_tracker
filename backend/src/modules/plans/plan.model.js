const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    durationWeeks: {
      type: Number,
      required: true,
    },

    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
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

module.exports = mongoose.model("Plan", planSchema);