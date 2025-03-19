import bcrypt from "bcryptjs";
import prisma from "../prisma";
import {
  UserOutput,
  userOutputSchema,
  UserUpdateInput,
} from "../schemas/users.schema";
import { AppError } from "../Errors/AppError";

export const UsersService = {
  getUsers: async (): Promise<UserOutput[]> => {
    const users = await prisma.user.findMany();
    if (!users) {
      throw new AppError("Nenhum usuário encontrado", 404);
    }
    return users.map((user) => userOutputSchema.parse(user));
  },

  getUserById: async (id: string, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? userOutputSchema.parse(user) : null;
  },

  getUserByEmail: async (email: string, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? userOutputSchema.parse(user) : null;
  },

  updateUser: async (id: string, data: UserUpdateInput, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (data.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (userWithEmail && userWithEmail.id !== id) {
        throw new AppError("Email já cadastrado", 400);
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return userOutputSchema.parse(updatedUser);
  },

  deleteUser: async (id: string, userId: string) => {
    if (userId === undefined) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const userbyId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userbyId?.role !== "ADMIN") {
      throw new AppError("Usuário não autorizado", 401);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await prisma.user.delete({ where: { id } });
  },
};
