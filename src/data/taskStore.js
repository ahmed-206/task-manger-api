const { randomUUID } = require("node:crypto");

let tasks = [];

function getTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask(data) {
  const task = {
    id: randomUUID(),
    title: data.title,
    description: data.description || "",
    completed: false,
    priority: data.priority || "medium",
  };

  tasks.push(task);

  return task;
}

function updateTask(id, updates) {
  const task = getTaskById(id);

  if (!task) return null;

  Object.assign(task, updates);

  return task;
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return null;

  const [deletedTask] = tasks.splice(taskIndex, 1);

  return deletedTask;
}

function clearTasks() {
  tasks = [];
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearTasks,
};