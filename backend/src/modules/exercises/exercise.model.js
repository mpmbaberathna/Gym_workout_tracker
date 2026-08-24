const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    muscleGroup: {
      type: String,
      required: true,
      trim: true,
    },

    equipment: {
      type: String,
      default: "",
      trim: true,
    },

    // exercise belongs to trainer
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);