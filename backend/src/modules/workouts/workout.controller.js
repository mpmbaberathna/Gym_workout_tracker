const Workout = require("./workout.model");

//create workout
exports.createWorkout = async (req, res) => {
  try {
    const { title, duration, notes, exercises } = req.body;

    if (!title || !Array.isArray(exercises) || exercises.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and exercises are required" });
    }

    const workout = await Workout.create({
      title,
      duration,
      notes,
      exercises,           // manual exercises (strings)
      createdBy: req.user.id,
    });

    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to('role:admin').emit('workouts:created', workout);
    } catch (e) {}

    res.status(201).json(workout);
  } catch (err) {
    console.error("CREATE WORKOUT ERROR:", err);
    res.status(500).json({ message: "Failed to create workout" });
  }
};

//trainer: get own workouts
exports.getTrainerWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      createdBy: req.user.id,
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workouts" });
  }
};

//update workout
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, duration, notes, exercises } = req.body;

    workout.title = title;
    workout.duration = duration;
    workout.notes = notes;
    workout.exercises = exercises;

    await workout.save();

    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${req.user.id}`).to('role:admin').emit('workouts:updated', workout);
    } catch (e) {}

    res.json(workout);
  } catch (err) {
    console.error("UPDATE WORKOUT ERROR:", err);
    res.status(500).json({ message: "Failed to update workout" });
  }
};

//delete workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workout.deleteOne();
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to('role:admin').emit('workouts:deleted', { id: req.params.id });
    } catch (e) {}

    res.json({ message: "Workout deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workout" });
  }
};

//assign workout to member
exports.assignWorkout = async (req, res) => {
  try {
    const { workoutId, memberId } = req.body;

    if (!workoutId || !memberId) {
      return res
        .status(400)
        .json({ message: "workoutId and memberId required" });
    }

    await Workout.findByIdAndUpdate(workoutId, {
      $addToSet: { assignedMembers: memberId },
    });

    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to(`user:${memberId}`).to('role:admin').emit('workouts:assigned', { workoutId, memberId });
    } catch (e) {}

    res.json({ message: "Workout assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign workout" });
  }
};

//member: get assigned workouts
exports.getWorkoutsForMember = async (req, res) => {
  try {
    const workouts = await Workout.find({
      assignedMembers: req.user.id,
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch member workouts" });
  }
}

//admin: get all workouts
exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate("createdBy", "email role");

    res.json(workouts);
  } catch (err) {
    console.error("GET ALL WORKOUTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch all workouts" });
  }
};