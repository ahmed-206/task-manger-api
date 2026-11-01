const taskStore = require("../data/taskStore");

const allowedPriorities = ["low", "medium", "high"];

function getAllTasks(req, res) {
  const tasks = taskStore.getTasks();

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
}

function getTask(req, res) {
  const task = taskStore.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
}

function createTask(req, res) {
  const { title, description, priority } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Title is required and must be a non-empty string",
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Description must be a string",
    });
  }

  if (
    priority !== undefined &&
    !allowedPriorities.includes(priority)
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Priority must be low, medium, or high",
    });
  }

  const task = taskStore.createTask({
    title: title.trim(),
    description,
    priority,
  });

  res.status(201).json({
    status: "success",
    data: { task },
  });
}

function updateTask(req, res) {
  const { title, description, completed, priority } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide at least one field to update",
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Title must be a non-empty string",
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Description must be aaa string",
    });
  }

  if (
    completed !== undefined &&
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Completed must be a boolean",
    });
  }

  if (
    priority !== undefined &&
    !allowedPriorities.includes(priority)
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Priority must be low, medium, or high",
    });
  }

  const updates = {};

  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description;
  if (completed !== undefined) updates.completed = completed;
  if (priority !== undefined) updates.priority = priority;

  const task = taskStore.updateTask(req.params.id, updates);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
}

function deleteTask(req, res) {
  const task = taskStore.deleteTask(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  res.status(204).send();
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};