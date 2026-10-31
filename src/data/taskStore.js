const { randomUUID } = require("node:crypto");

let tasks = [];

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask({ title, description = "" }) {
  const task = {
    id: randomUUID(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

function updateTask(id, updates) {
  const task = getTaskById(id);

  if (!task) {
    return null;
  }

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) {
    task.description = updates.description;
  }
  if (updates.completed !== undefined) {
    task.completed = updates.completed;
  }

  return task;
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}

// Used by tests to start each test with clean in-memory data.
function clearTasks() {
  tasks = [];
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearTasks,
};
