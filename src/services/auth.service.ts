import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../prisma";
import {
  RegisterInput,
  UserOutput,
  userOutputSchema,
} from "../schemas/auth.schema";
import { AppError } from "../Errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const AuthService = {
  login: async (email: string, password: string): Promise<string> => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    return token;
  },

  register: async (
    data: RegisterInput,
    userId: string
  ): Promise<UserOutput> => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new AppError("Usuário já cadastrado", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "COMMON",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const parsedUser = userOutputSchema.parse(newUser);
    return parsedUser;
  },
};
