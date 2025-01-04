const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole,
  getIssueStats,
} = require("../controllers/projectController");
const authenticate = require("../middleware/VerifyToken"); // Middleware to verify token

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

router.post("/", createProject); // Create a project
router.get("/", getProjects); // Get all projects for the logged-in user
router.get("/:id", getProjectById); // Get a specific project by ID
router.put("/:id", updateProject); // Update a project
router.delete("/:id", deleteProject); // Delete a project
router.post("/:id/members", authenticate, addMember); // Add a member
router.delete("/:id/members/:memberId", authenticate, removeMember); // Remove a member
router.put("/:id/members/:memberId", authenticate, updateMemberRole); // Update member role
router.get("/:id/stats", getIssueStats);

module.exports = router;
