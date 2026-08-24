const User = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
exports.register = async (req, res) => {
  try {
    //accept role from body
    const { name, email, password } = req.body;
    const requestedRole = req.body.role || req.query.role;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //name validation
    const hasLetter = /[A-Za-z]/.test(name);
    const isNumericOnly = /^\d+$/.test(name.trim());
    if (!hasLetter || isNumericOnly || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must include letters and cannot be numeric-only (min 2 characters)" });
    }

    //password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //only allow creating users with role 'trainer' or 'member'. default to 'member'.
    const allowedRoles = ["trainer", "member"];
    const normalizedRequested = (requestedRole || "").toString().trim().toLowerCase();
    const role = allowedRoles.includes(normalizedRequested)
      ? normalizedRequested
      : "member";


    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    //emit user change to admins only
    try {
      const socketLib = require('../../sockets/socket');
      const io = socketLib.getIO();
      if (io) io.to('role:admin').emit('users:changed');
    } catch (e) {}

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //create a JWT for API clients
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //set server-side session for browser clients
    if (req.session) {
      req.session.user = { id: user._id.toString(), role: user.role };
    }

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//logout
exports.logout = async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out' });
    });
  } else {
    res.json({ message: 'No active session' });
  }
};

//admin
exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["admin", "trainer", "member"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (req.user.id === req.params.id) {
    return res.status(403).json({ message: "Cannot change own role" });
  }
  //prevent changing role of existing admins
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target.role === 'admin') return res.status(403).json({ message: 'Cannot change role of an admin' });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
};

//update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(403).json({ message: "Cannot delete yourself" });
  }
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target.role === 'admin') return res.status(403).json({ message: 'Cannot delete an admin' });

  await User.findByIdAndDelete(req.params.id);
  try {
    const socketLib = require('../../sockets/socket');
    const io = socketLib.getIO();
    if (io) io.emit('users:changed');
  } catch (e) {}

  res.json({ message: "User deleted successfully" });
};

//trainer
exports.assignTrainer = async (req, res) => {
  const { memberId, trainerId } = req.body;

  const member = await User.findById(memberId);
  const trainer = await User.findById(trainerId);

  if (!member || member.role !== "member") {
    return res.status(400).json({ message: "Invalid member" });
  }

  if (!trainer || trainer.role !== "trainer") {
    return res.status(400).json({ message: "Invalid trainer" });
  }

  member.trainer = trainerId;
  await member.save();

  res.json({ message: "Trainer assigned successfully" });
};

exports.getMyMembers = async (req, res) => {
  const members = await User.find({
    role: "member",
    trainer: req.user.id,
  }).select("-password");

  res.json(members);
};

exports.getMembersOnly = async (req, res) => {
  const members = await User.find({ role: "member" }).select("_id email name");
  res.json(members);
};

//get /me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//put /me
exports.updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      update.password = hashed;
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete /me
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};