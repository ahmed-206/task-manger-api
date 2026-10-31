# Task Manager API

A small Express REST API built to practice Node.js testing and GitHub Actions CI.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```bash
npm install
```

## Run the API

```bash
npm start
```

The API runs at `http://localhost:3000` by default.

## Run tests

```bash
npm test
```

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Create task example

```json
{
  "title": "Learn GitHub Actions",
  "description": "Build my first CI pipeline"
}
```

## Storage note

Tasks are stored in memory. They reset whenever the Node.js process restarts. This is intentional for this learning project; a database can be added later.

## CI

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`. It installs dependencies with `npm ci` and runs the automated tests.
