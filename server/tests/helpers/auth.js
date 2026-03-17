import User from "../../src/models/user.js";
import { generateToken } from "../../src/utils/jwt.js";

export const createUser = async (overrides = {}) => {
  const timestamp = Date.now();
  return User.create({
    name: "Test User",
    email: `test-${timestamp}-${Math.random().toString(36).slice(2, 7)}@example.com`,
    password: "Password1",
    ...overrides,
  });
};

export const createVerifiedUser = async (overrides = {}) => {
  return createUser({
    isAccountVerified: true,
    ...overrides,
  });
};

export const bearerForUser = (user) => `Bearer ${generateToken(user._id)}`;
