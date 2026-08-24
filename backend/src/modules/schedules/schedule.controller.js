const Schedule = require("./schedule.model");
const User = require("../users/user.model");

//trainer create schedule
exports.createSchedule = async (req, res) => {
  try {
    const { memberId, workoutId, scheduledDate } = req.body;

    if (!memberId || !workoutId || !scheduledDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    const member = await User.findOne({
      _id: memberId,
      trainer: req.user.id,
    });

    if (!member) {
      return res.status(403).json({ message: "Member not assigned to you" });
    }

    const schedule = await Schedule.create({
      trainer: req.user.id,
      member: memberId,
      workout: workoutId,
      scheduledDate,
    });

    //notify trainer and member directly
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to(`user:${memberId}`).emit('schedules:created', schedule);
    } catch (e) {}

    res.status(201).json(schedule);
  } catch (err) {
    console.error("CREATE SCHEDULE ERROR:", err);
    res.status(500).json({ message: "Failed to create schedule" });
  }
};

//member get my schedule
exports.getMemberSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      member: req.user.id,
    }).populate("workout");

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

//trainer get my schedules
exports.getTrainerSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      trainer: req.user.id,
    })
      .populate("member", "email")
      .populate("workout");

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};

//delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      trainer: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to(`user:${schedule.member}`).emit('schedules:deleted', { id: req.params.id });
    } catch (e) {}

    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};

//trainer update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { memberId, workoutId, scheduledDate } = req.body;

    if (!memberId && !workoutId && !scheduledDate) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    //ensure member exists
    const member = await User.findOne({ _id: memberId });
    if (!member) return res.status(400).json({ message: "Invalid member" });

    if (member.trainer && member.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Member not assigned to you" });
    }

    const update = {};
    if (memberId) update.member = memberId;
    if (workoutId) update.workout = workoutId;
    if (scheduledDate) update.scheduledDate = scheduledDate;

    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, trainer: req.user.id },
      update,
      { new: true }
    )
      .populate("member", "email name")
      .populate("workout");

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to(`user:${schedule.member?._id || schedule.member}`).emit('schedules:updated', schedule);
    } catch (e) {}

    res.json(schedule);
  } catch (err) {
    console.error("UPDATE SCHEDULE ERROR:", err);
    res.status(500).json({ message: "Failed to update schedule" });
  }
};

//get schedule by id
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("member", "email name trainer")
      .populate("workout");

    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    //allow admin or the owning trainer
    const isOwner = schedule.trainer && schedule.trainer.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this schedule" });
    }

    res.json(schedule);
  } catch (err) {
    console.error("GET SCHEDULE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

//member complete schedule
exports.completeSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, member: req.user.id },
      { status: 'completed' },
      { new: true }
    )
    .populate("member", "email name")
    .populate("workout");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found or not authorized" });
    }

    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to(`user:${schedule.trainer}`).emit('schedules:updated', schedule);
    } catch (e) {}

    res.json(schedule);
  } catch (err) {
    console.error("COMPLETE SCHEDULE ERROR:", err);
    res.status(500).json({ message: "Failed to mark schedule as complete" });
  }
};