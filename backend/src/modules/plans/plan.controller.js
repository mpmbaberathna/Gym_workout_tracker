const Plan = require("./plan.model");
const Exercise = require("../exercises/exercise.model");
const mongoose = require("mongoose");

// Resolve incoming exercises (may be names or ids) to ObjectId ids
async function resolveExerciseIds(items) {
  if (!Array.isArray(items)) return [];
  const ids = [];
  for (const it of items) {
    if (!it) continue;
    
    if (mongoose.Types.ObjectId.isValid(it)) {
      ids.push(it);
      continue;
    }

    //find exercise by name
    const ex = await Exercise.findOne({ name: it });
    if (ex) ids.push(ex._id);
  
  }
  return ids;
}

//create plan
exports.createPlan = async (req, res) => {
  try {
    const { title, description, durationWeeks, exercises } = req.body;

    const exerciseIds = await resolveExerciseIds(exercises);

    const plan = await Plan.create({
      title,
      description,
      durationWeeks,
      exercises: exerciseIds,
      createdBy: req.user.id,
    });

    // populate before returning
    await plan.populate('exercises');

    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//trainer: get own plans 
exports.getTrainerPlans = async (req, res) => {
  const plans = await Plan.find({ createdBy: req.user.id }).populate("exercises");
  const normalized = await Promise.all(plans.map(async (p) => {
    const exs = await Promise.all((p.exercises || []).map(async (it) => {
      if (!it) return null;
      if (typeof it === 'object' && it._id) return it;
      if (mongoose.Types.ObjectId.isValid(it)) {
        const found = await Exercise.findById(it);
        return found || it;
      }
      const foundByName = await Exercise.findOne({ name: it });
      return foundByName || it;
    }));
    p = p.toObject();
    p.exercises = exs.filter(Boolean);
    return p;
  }));

  res.json(normalized);
};

//admin: get all plans
exports.getAllPlans = async (req, res) => {
  const plans = await Plan.find().populate("exercises").populate("createdBy", "name email role");
  const normalized = await Promise.all(plans.map(async (p) => {
    const exs = await Promise.all((p.exercises || []).map(async (it) => {
      if (!it) return null;
      if (typeof it === 'object' && it._id) return it;
      if (mongoose.Types.ObjectId.isValid(it)) {
        const found = await Exercise.findById(it);
        return found || it;
      }
      const foundByName = await Exercise.findOne({ name: it });
      return foundByName || it;
    }));
    p = p.toObject();
    p.exercises = exs.filter(Boolean);
    return p;
  }));

  res.json(normalized);
};

//assign plan to member
exports.assignPlan = async (req, res) => {
  const { planId, memberId } = req.body;

  await Plan.findByIdAndUpdate(planId, {
    $addToSet: { assignedMembers: memberId },
  });

  res.json({ message: "Plan assigned successfully" });
};

//member: get assigned plans
exports.getMemberPlans = async (req, res) => {
  const plans = await Plan.find({ assignedMembers: req.user.id }).populate("exercises");
  const normalized = await Promise.all(plans.map(async (p) => {
    const exs = await Promise.all((p.exercises || []).map(async (it) => {
      if (!it) return null;
      if (typeof it === 'object' && it._id) return it;
      if (mongoose.Types.ObjectId.isValid(it)) {
        const found = await Exercise.findById(it);
        return found || it;
      }
      const foundByName = await Exercise.findOne({ name: it });
      return foundByName || it;
    }));
    p = p.toObject();
    p.exercises = exs.filter(Boolean);
    return p;
  }));

  res.json(normalized);
};

//delete plan
exports.deletePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  if (
    req.user.role === "trainer" &&
    plan.createdBy.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await plan.deleteOne();
  res.json({ message: "Plan deleted successfully" });
};

//update plan
exports.updatePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  if (req.user.role === "trainer" && plan.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { title, description, durationWeeks, exercises } = req.body;

  const exerciseIds = await resolveExerciseIds(exercises);

  plan.title = title;
  plan.description = description;
  plan.durationWeeks = durationWeeks;
  plan.exercises = exerciseIds;

  await plan.save();

  await plan.populate('exercises');

  res.json({ message: "Plan updated successfully", plan });
};