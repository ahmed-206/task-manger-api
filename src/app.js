const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Task Manager API is running",
  });
});

app.use("/api/tasks", taskRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Handle malformed JSON and unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid JSON body",
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

module.exports = app;
