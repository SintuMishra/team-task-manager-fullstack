import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const baseUrl = process.env.SMOKE_BASE_URL || `http://localhost:${process.env.PORT || 5000}/api`;

const demoAccounts = [
  {
    label: "admin",
    email: "admin@example.com",
    password: "admin123",
  },
  {
    label: "member",
    email: "member@example.com",
    password: "member123",
  },
];

const requiredArrayFields = ["myAssignedTasks", "recentTasks", "projectProgress"];
const requiredCountFields = [
  "totalProjects",
  "totalTasks",
  "todoTasks",
  "inProgressTasks",
  "completedTasks",
  "overdueTasks",
];

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

async function readJsonResponse(response) {
  const raw = await response.text();

  if (!raw) {
    throw new Error(`Empty response body from ${response.url} (${response.status})`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Expected JSON from ${response.url} (${response.status}), received: ${raw.slice(0, 180)}`
    );
  }
}

async function login(email, password) {
  let response;

  try {
    response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    throw new Error(
      `Could not reach ${baseUrl}. Make sure the backend server is running and the database is available. Original error: ${error.message}`
    );
  }

  const payload = await readJsonResponse(response);

  assert(response.ok, `Login failed for ${email}: ${payload.message || response.statusText}`);
  assert(payload.token, `Missing token in login response for ${email}`);

  return payload.token;
}

async function fetchDashboard(token) {
  let response;

  try {
    response = await fetch(`${baseUrl}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(
      `Could not reach ${baseUrl}/dashboard. Make sure the backend server is running and accessible. Original error: ${error.message}`
    );
  }

  const payload = await readJsonResponse(response);

  assert(response.ok, `Dashboard request failed: ${payload.message || response.statusText}`);

  for (const field of requiredCountFields) {
    assert(typeof payload[field] === "number", `Dashboard field "${field}" is missing or not a number`);
  }

  for (const field of requiredArrayFields) {
    assert(Array.isArray(payload[field]), `Dashboard field "${field}" is missing or not an array`);
  }

  return payload;
}

async function run() {
  console.log(`Running dashboard smoke test against ${baseUrl}`);

  for (const account of demoAccounts) {
    const token = await login(account.email, account.password);
    const dashboard = await fetchDashboard(token);

    console.log(
      [
        `[${account.label}] ok`,
        `projects=${dashboard.totalProjects}`,
        `tasks=${dashboard.totalTasks}`,
        `inProgress=${dashboard.inProgressTasks}`,
        `completed=${dashboard.completedTasks}`,
        `overdue=${dashboard.overdueTasks}`,
      ].join(" | ")
    );
  }

  console.log("Dashboard smoke test passed.");
}

run().catch((error) => {
  console.error(`Dashboard smoke test failed: ${error.message}`);
  process.exit(1);
});
