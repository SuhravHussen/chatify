import { GraphQLError } from "graphql";
import conversationService from "../../services/conversation";

const queries = {
  getConversations: async (_: any, payload: any, context: any) => {
    if (context && context.user) {
      const conversations = await conversationService.getConversations(
        payload.receiver,
        payload.sender,
        payload.take
      );
      return {
        conversations: conversations.conversations,
        hasMore: conversations.hasMore,
      };
    } else {
      throw new GraphQLError("You are unauthorized", {
        extensions: {
          code: 401,
        },
      });
    }
  },
  getContacts: async (_: any, payload: any, context: any) => {
    if (context && context.user) {
      const contacts = await conversationService.getContacts(payload.user);
      return contacts;
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
  createConversation: async (_: any, payload: any, context: any) => {
    if (context && context.user) {
      const conversation = await conversationService.createConversation(
        payload
      );
      return conversation;
    } else {
      throw new GraphQLError("You are unauthorized", {
        extensions: {
          code: 401,
        },
      });
    }
  },
};

export const resolvers = { queries, mutations };
