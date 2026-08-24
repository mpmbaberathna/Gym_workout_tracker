const Exercise = require("./exercise.model");


exports.getExercises = async (req, res) => {
  const exercises = await Exercise.find({ trainer: req.user.id });
  res.json(exercises);
};

exports.createExercise = async (req, res) => {
  try {
    const { name, muscleGroup, equipment } = req.body;

    if (!name || !muscleGroup) {
      return res.status(400).json({ message: "Name and muscle group required" });
    }

    const exercise = await Exercise.create({
      name,
      muscleGroup,
      equipment,
      trainer: req.user.id,
    });

    res.status(201).json(exercise);
  } catch (err) {
    console.error("CREATE EXERCISE ERROR:", err);
    res.status(500).json({ message: "Failed to create exercise" });
  }
};

exports.updateExercise = async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return res.status(404).json({ message: "Exercise not found" });
  }

  if (exercise.trainer.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(exercise, req.body);
  await exercise.save();

  res.json(exercise);
};

exports.deleteExercise = async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return res.status(404).json({ message: "Exercise not found" });
  }

  if (exercise.trainer.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await exercise.deleteOne();
  res.json({ message: "Exercise deleted" });
};