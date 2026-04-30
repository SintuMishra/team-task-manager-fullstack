import { TaskStatus, Priority } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim().min(1, "Project description is required"),
});

export const addProjectMemberSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().min(1, "Task description is required"),
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: "Status must be TODO, IN_PROGRESS, or DONE" }),
  }),
  priority: z.nativeEnum(Priority, {
    errorMap: () => ({ message: "Priority must be LOW, MEDIUM, or HIGH" }),
  }),
  dueDate: z.string().datetime("Due date is required"),
  assignedToId: z.string().trim().min(1, "Assigned user is required"),
});

export const taskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: "Status must be TODO, IN_PROGRESS, or DONE" }),
  }),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
});
