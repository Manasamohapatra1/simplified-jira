const { DESCRIBE } = require("sequelize/lib/query-types");
const Project = require("../models/Project");

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
    const projects = await Project.find({ ownerId: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Project not found" });
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

    res.status(200).json(project);
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
