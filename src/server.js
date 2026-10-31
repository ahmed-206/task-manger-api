const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Task Manager API is listening on port ${PORT}`);
});
