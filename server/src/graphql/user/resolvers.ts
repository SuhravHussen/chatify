import setCookie from "../../lib/setCookie";
import UserService, { CreateUserPayload } from "../../services/user";
import { emailSchema } from "./validation";
import { GraphQLError } from "graphql";

const queries = {
  checkAuth: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const email = context.user.email;
      const user = await UserService.checkAuth(email);
      return user;
    }
  },

  getUserByEmail: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const { email } = parameters;
      const user = await UserService.getUserByEmail(email);

      return user;
    } else {
      throw new GraphQLError("You are unauthorized", {
        extensions: {
          code: 401,
        },
      });
    }
  },

  logout: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      await UserService.updateLastLogin(context.user.email);
      context.res.clearCookie("token");
      return true;
    } else {
      throw new GraphQLError("You are unauthorized", {
        extensions: {
          code: 401,
        },
      });
    }
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload, { res }: any) => {
    const { error } = emailSchema.validate(payload);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const token = UserService.getUserToken(payload.email);
    setCookie(res, token);

    const user = await UserService.createUser(payload);
    return {
      ...user,
    };
  },
};

export const resolvers = { queries, mutations };
