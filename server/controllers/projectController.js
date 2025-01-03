const { DESCRIBE } = require("sequelize/lib/query-types");
const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
    const project = new Project({ name, description, ownerId });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {

    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
    // Fetch projects where the user is either the owner or a member
    const projects = await Project.find({
      $or: [
        { ownerId: userId }, // Projects owned by the user
        { "members.userId": userId }, // Projects where the user is a member
      ],
    })
      .populate("ownerId", "username email") // Populate owner details
      .populate("members.userId", "username email"); // Populate member details
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
    const project = await Project.findById(req.params.id)
      .populate("ownerId", "username email") // Populate owner details
      .populate("members.userId", "username email"); // Populate member details;
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Check if the user is authorized to view this project
    const isMember = project.members.some(
      (member) => member.userId._id.toString() === userId
    );

    const isOwner = project.ownerId._id.toString() === userId;

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }
    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { description, name } = req.body;
    const project = await Project.findById(req.params.id);
    console.log(project);

    if (!project || project.ownerId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    project.name = name || project.name;
    project.description = description;
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate("members.userId", "username email") // Populate member details
      .populate("ownerId", "username email"); // Populate owner details

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.ownerId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

// Add a member to a project
exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const projectId = req.params.id;
    console.log(req.body);  

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the owner can add members
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to add members" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Check if the user is already a member
    const isAlreadyMember = project.members.some(
      (member) => member.userId.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member of this project" });
    }
    
    // Add the user as a member with the specified role
    project.members.push({ userId: user._id, role: role || "Contributor" });
    await project.save();

    // Re-fetch the updated project with populated members
    const updatedProject = await Project.findById(projectId)
      .populate("members.userId", "username email") // Populate member details
      .populate("ownerId", "username email"); // Populate owner details

    res.status(200).json(updatedProject);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add member" });
  }
};

// Remove a member from a project
exports.removeMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.memberId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the owner can remove members
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to remove members" });
    }

    project.members = project.members.filter((member) => member.userId.toString() !== memberId);
    await project.save();

    // Re-fetch the updated project with populated members
    const updatedProject = await Project.findById(projectId)
      .populate("members.userId", "username email") // Populate member details
      .populate("ownerId", "username email"); // Populate owner details

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove member" });
  }
};

// Update a member's role
exports.updateMemberRole = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.memberId;
    const { role } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the owner can update roles
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update roles" });
    }

    const member = project.members.find((m) => m.userId.toString() === memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await project.save();

    // Re-fetch the updated project with populated members
    const updatedProject = await Project.findById(projectId)
      .populate("members.userId", "username email") // Populate member details
      .populate("ownerId", "username email"); // Populate owner details

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role" });
  }
};
