const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Owner", "Admin", "Contributor", "Viewer"],
    default: "Contributor",
  },
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [MemberSchema], // List of members with roles
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
