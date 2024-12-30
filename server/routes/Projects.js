const express = require("express");
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/projectController");
const authenticate = require("../middleware/VerifyToken"); // Middleware to verify token

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

router.post("/", createProject); // Create a project
router.get("/", getProjects); // Get all projects for the logged-in user
router.get("/:id", getProjectById); // Get a specific project by ID
router.put("/:id", updateProject); // Update a project
router.delete("/:id", deleteProject); // Delete a project

module.exports = router;
