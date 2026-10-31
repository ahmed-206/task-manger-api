const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");
const taskStore = require("../src/data/taskStore");

test.beforeEach(() => {
  taskStore.clearTasks();
});

test("GET /api/health returns API health status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /api/tasks returns an empty list initially", async () => {
  const response = await request(app).get("/api/tasks");

  assert.equal(response.status, 200);
  assert.equal(response.body.results, 0);
  assert.deepEqual(response.body.data.tasks, []);
});

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
  assert.ok(response.body.data.task.id);
});

test("POST /api/tasks rejects an empty title", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .send({ title: "   " });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /Title is required/);
});

test("GET /api/tasks/:id returns an existing task", async () => {
  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Practice testing" });

  const taskId = created.body.data.task.id;
  const response = await request(app).get(`/api/tasks/${taskId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.data.task.id, taskId);
});

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

test("unknown routes return 404", async () => {
  const response = await request(app).get("/not-a-real-route");

  assert.equal(response.status, 404);
});
