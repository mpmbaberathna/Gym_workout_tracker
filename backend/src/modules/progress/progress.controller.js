const Progress = require("./progress.model");

//CREATE
exports.createProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      ...req.body,
      user: req.user.id
    });
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      //notify the user and their trainer
      const User = require('../users/user.model');
      const usr = await User.findById(req.user.id).select('trainer');
      if (io) {
        const op = io.to(`user:${req.user.id}`);
        if (usr && usr.trainer) op.to(`user:${usr.trainer.toString()}`);
        op.emit('progress:created', progress);
      }
    } catch (e) {}
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//READ ALL
exports.getProgress = async (req, res) => {
  const progress = await Progress.find({ user: req.user.id })
    .populate("workout");
  res.json(progress);
};

//READ ONE
exports.getProgressById = async (req, res) => {
  const progress = await Progress.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate("workout");

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }
  res.json(progress);

  try {
    const socketLib = require('../../sockets/socket');
    const io = socketLib.getIO();
    const User = require('../users/user.model');
    const usr = await User.findById(progress.user).select('trainer');
    if (io) {
      const op = io.to(`user:${progress.user}`);
      if (usr && usr.trainer) op.to(`user:${usr.trainer.toString()}`);
      op.emit('progress:updated', progress);
    }
  } catch (e) {}

  res.json(progress);
};

//UPDATE
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("workout");

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    // socket notify user + trainer
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      const User = require('../users/user.model');
      const usr = await User.findById(progress.user).select('trainer');

      if (io) {
        const op = io.to(`user:${progress.user}`);
        if (usr && usr.trainer) op.to(`user:${usr.trainer.toString()}`);
        op.emit('progress:updated', progress);
      }
    } catch (e) {}

    res.json(progress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//DELETE
exports.deleteProgress = async (req, res) => {
  const progress = await Progress.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }
  try {
    const socketLib = require('../../sockets/socket');
    const io = socketLib.getIO();
    const User = require('../users/user.model');
    const usr = await User.findById(progress.user).select('trainer');
    if (io) {
      const op = io.to(`user:${progress.user}`);
      if (usr && usr.trainer) op.to(`user:${usr.trainer.toString()}`);
      op.emit('progress:deleted', { id: req.params.id });
    }
  } catch (e) {}

  res.json({ message: "Progress deleted" });
};

//trainer: view assigned member progress
exports.getProgressForTrainer = async (req, res) => {
  try {
    const Progress = require("./progress.model");
    const User = require("../users/user.model");

    // members assigned to this trainer
    const members = await User.find({ trainer: req.user.id }).select("_id");
    const memberIds = members.map((m) => m._id);

    const progress = await Progress.find({ user: { $in: memberIds } })
      .populate("user", "email")
      .populate("workout");

    res.json(progress);
  } catch (err) {
    console.error("TRAINER PROGRESS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch trainer progress" });
  }
};