const taskStore = require("../data/taskStore");

function getAllTasks(req, res) {
  return res.status(200).json({
    status: "success",
    results: taskStore.getAllTasks().length,
    data: {
      tasks: taskStore.getAllTasks(),
    },
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

  return res.status(200).json({
    status: "success",
    data: { task },
  });
}

function createTask(req, res) {
  const { title, description } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
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

  const task = taskStore.createTask({
    title: title.trim(),
    description: description?.trim() ?? "",
  });

  return res.status(201).json({
    status: "success",
    data: { task },
  });
}

function updateTask(req, res) {
  const { title, description, completed } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Provide at least one field to update",
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
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
      message: "Description must be a string",
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      status: "fail",
      message: "Completed must be a boolean",
    });
  }

  const updates = {
    ...(title !== undefined ? { title: title.trim() } : {}),
    ...(description !== undefined
      ? { description: description.trim() }
      : {}),
    ...(completed !== undefined ? { completed } : {}),
  };

  const task = taskStore.updateTask(req.params.id, updates);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: { task },
  });
}

function deleteTask(req, res) {
  const deleted = taskStore.deleteTask(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  return res.status(204).send();
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
