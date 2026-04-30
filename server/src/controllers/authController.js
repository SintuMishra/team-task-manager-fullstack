import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { ApiError, asyncHandler } from "../utils/error.js";
import { signToken } from "../utils/jwt.js";
import { sanitizeUser } from "../utils/serializers.js";
import { loginSchema, profileSchema, signupSchema } from "../utils/validators.js";

const authResponse = (user) => ({
  token: signToken(user),
  user: sanitizeUser(user),
});

export const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);
  const existingUser = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: "MEMBER",
    },
  });

  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const matches = await bcrypt.compare(data.password, user.passwordHash);

  if (!matches) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json(authResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = profileSchema.parse(req.body);
  const email = data.email.toLowerCase();

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: req.user.id },
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Another account already uses this email");
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: data.name,
      email,
    },
  });

  res.json({ user: sanitizeUser(user) });
});
