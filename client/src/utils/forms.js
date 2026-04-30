export const validateAuthForm = ({ name, email, password }, isSignup = false) => {
  if (isSignup && !name.trim()) {
    return "Name is required";
  }
  if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
    return "A valid email is required";
  }
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return "";
};

export const validateProjectForm = ({ name, description }) => {
  if (!name.trim()) return "Project name is required";
  if (!description.trim()) return "Project description is required";
  return "";
};

export const validateTaskForm = ({ title, description, dueDate, assignedToId, status, priority }) => {
  if (!title.trim()) return "Task title is required";
  if (!description.trim()) return "Task description is required";
  if (!dueDate) return "Due date is required";
  if (!assignedToId) return "Assigned user is required";
  if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) return "Status is invalid";
  if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) return "Priority is invalid";
  return "";
};
