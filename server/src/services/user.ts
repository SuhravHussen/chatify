import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";

const JWT_SECRET = "$uperM@n@123";

export interface CreateUserPayload {
  name: string;
  email: string;
}

export interface GetUserTokenPayload {
  email: string;
}

class UserService {
  public static async createUser(payload: CreateUserPayload) {
    try {
      const { name, email } = payload;

      const user = await this.getUserByEmail(email);
      if (user) {
        return await this.getUserByEmail(email);
      }

      return prismaClient.user.create({
        data: {
          name,
          email,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  public static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static getUserToken(email: string) {
    // Gen Token
    const token = JWT.sign({ email: email }, JWT_SECRET);
    return token;
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }

  public static checkAuth(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static updateLastLogin(email: string) {
    if (!email)
      return new Promise((res, rej) => {
        rej(new Error("invalid email"));
      });
    return prismaClient.user.update({
      where: { email },
      data: {
        lastLogin: new Date(),
      },
    });
  }

  public static updateActiveStatus(email: string, active: boolean) {
    return prismaClient.user.update({
      where: { email },
      data: {
        active: active,
      },
    });
  }
}

export default UserService;
