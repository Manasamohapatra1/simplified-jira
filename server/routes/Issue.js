const express = require("express");
const {
    createIssue,
    getIssues,
    updateIssue,
    deleteIssue,
    addComment,
    getComments,
    getIssue
} = require("../controllers/Issuecontroller");
const verifyToken = require("../middleware/VerifyToken");

const router = express.Router();

// Issue routes
router.post("/:projectId", verifyToken, createIssue);
router.get("/:projectId", verifyToken, getIssues);
router.get("/issue/:id", verifyToken, getIssue);
router.put("/:id", verifyToken, updateIssue);
router.delete("/:id", verifyToken, deleteIssue);
router.post("/:id/comments", verifyToken, addComment); // Add a comment
router.get("/:id/comments", verifyToken, getComments); // Get all comments for an issue


module.exports = router;
