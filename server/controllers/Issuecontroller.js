const Issue = require("../models/Issue");

// Create an issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, type, status, assigneeId } = req.body;
    const projectId = req.params.projectId;
    const createdBy = req.user.id;

    const issue = new Issue({
      title,
      description,
      type,
      status,
      assigneeId,
      projectId,
      createdBy,
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create issue" });
  }
};

// Get all issues for a project
exports.getIssues = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const issues = await Issue.find({ projectId }).populate("assigneeId", "name email");
    res.status(200).json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};

exports.getIssue = async (req, res) => {
    try {
      const issueId = req.params.id;
  
      const issue = await Issue.findById(issueId).populate("assigneeId", "name email");
  
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
  
      res.status(200).json(issue);
    } catch (err) {
      console.error("Error fetching issue:", err);
      res.status(500).json({ message: "Failed to fetch issue" });
    }
  };

// Update an issue
exports.updateIssue = async (req, res) => {
  try {
    const { title, description, type, status, assigneeId } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.type = type || issue.type;
    issue.status = status || issue.status;
    issue.assigneeId = assigneeId || issue.assigneeId;

    await issue.save();
    res.status(200).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update issue" });
  }
};

// Delete an issue
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.deleteOne();
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete issue" });
  }
};

exports.addComment = async (req, res) => {
    try {
      const { text } = req.body;
      const issueId = req.params.id;
  
      if (!text) {
        return res.status(400).json({ message: "Comment text is required" });
      }
  
      const issue = await Issue.findById(issueId);
  
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
  
      const comment = {
        text,
        authorId: req.user.id,
      };
  
      issue.comments.push(comment);
      await issue.save();
  
      res.status(201).json(issue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add comment" });
    }
};

exports.getComments = async (req, res) => {
    try {
      const issueId = req.params.id;
  
      const issue = await Issue.findById(issueId).populate("comments.authorId", "name email");
  
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
  
      res.status(200).json(issue.comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
};
  
