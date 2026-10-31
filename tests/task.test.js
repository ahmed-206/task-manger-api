const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const taskStore = require("../src/data/taskStore");

test.beforeEach(() => {
  taskStore.clearTasks();
});

// Health check

test("GET /api/health returns API health status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

// Get all tasks

test("GET /api/tasks returns an empty list initially", async () => {
  const response = await request(app).get("/api/tasks");

  assert.equal(response.status, 200);
  assert.equal(response.body.results, 0);
  assert.deepEqual(response.body.data.tasks, []);
});

// Create tasks

test("POST /api/tasks creates a task", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({
      title: "Learn GitHub Actions",
      description: "Build my first CI pipeline",
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.task.title, "Learn GitHub Actions");
  assert.equal(response.body.data.task.completed, false);
  assert.equal(response.body.data.task.priority, "medium");
  assert.ok(response.body.data.task.id);
});

test("POST /api/tasks creates a task with high priority", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({
      title: "Fix production bug",
      priority: "high",
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.task.priority, "high");
});

test("POST /api/tasks creates a task with low priority", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({
      title: "Organize documentation",
      priority: "low",
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.task.priority, "low");
});

test("POST /api/tasks rejects an invalid priority", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({
      title: "Invalid task",
      priority: "urgent",
    });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /Priority must be low, medium, or high/);
});

test("POST /api/tasks rejects an empty title", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "   " });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /Title is required/);
});

// Get task by ID

test("GET /api/tasks/:id returns an existing task", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Practice testing" });

  const taskId = created.body.data.task.id;
  const response = await request(app).get(`/api/tasks/${taskId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.data.task.id, taskId);
});

// Update tasks

test("PATCH /api/tasks/:id updates a task", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Old title" });

  const taskId = created.body.data.task.id;

  const response = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .send({ completed: true, title: "New title" });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.task.title, "New title");
  assert.equal(response.body.data.task.completed, true);
});

test("PATCH /api/tasks/:id updates task priority", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Learn CI/CD" });

  const taskId = created.body.data.task.id;

  const response = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .send({ priority: "high" });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.task.priority, "high");
});

test("PATCH /api/tasks/:id rejects an invalid priority", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Learn CI/CD" });

  const taskId = created.body.data.task.id;

  const response = await request(app)
    .patch(`/api/tasks/${taskId}`)
    .send({ priority: "urgent" });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /Priority must be low, medium, or high/);
});

// Delete tasks

test("DELETE /api/tasks/:id deletes a task", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Temporary task" });

  const taskId = created.body.data.task.id;
  const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);
  const getResponse = await request(app).get(`/api/tasks/${taskId}`);

  assert.equal(deleteResponse.status, 204);
  assert.equal(getResponse.status, 404);
});

// Unknown routes

test("unknown routes return 404", async () => {
  const response = await request(app).get("/not-a-real-route");

  assert.equal(response.status, 404);
});

