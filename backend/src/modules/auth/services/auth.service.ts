import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { findUserByEmail } from "../repositories/auth.repository";
import type { LoginResult } from "../types/auth.types";

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user || user.status !== "active") {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      status: user.status,
    },
    env.jwtAccessSecret,
    { expiresIn: "12h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    },
  };
};
