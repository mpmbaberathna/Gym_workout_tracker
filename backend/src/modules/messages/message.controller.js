const Message = require("./message.model");
const nodemailer = require("nodemailer");


exports.createMessage = async (req, res) => {
  const { name, email, message } = req.body;

  const newMessage = await Message.create({
    name,
    email,
    message,
  });

  res.status(201).json(newMessage);
};


exports.getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};


exports.replyMessage = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  
  message.reply = reply;
  message.repliedAt = new Date();
  await message.save();

  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("Sending email to:", message.email);

  await transporter.sendMail({
    from: `"Gym Tracker" <${process.env.EMAIL_USER}>`,
    to: message.email,
    subject: "Reply from Gym Tracker",
    text: reply,
  });

  res.json({
    message: "Reply saved and email sent",
  });
};


exports.deleteMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ msg: "Message deleted" });
}