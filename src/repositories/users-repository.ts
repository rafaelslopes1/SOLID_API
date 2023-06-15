import { Prisma, User } from "@prisma/client";
import { Primitive } from "zod";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}