import { ApolloServer } from "@apollo/server";
import { User } from "./user";
import { Conversation } from "./conversation";

async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
       
        scalar DateTime
            ${User.typeDefs}
            ${Conversation.typeDefs}
            type Query {
               ${User.queries}
               ${Conversation.queries}
            }

            type Mutation {
               ${User.mutations}
                ${Conversation.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Conversation.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
        ...Conversation.resolvers.mutations,
      },
    },

    formatError: (err) => {
      return {
        message: err.message,
        code: err.extensions?.code,
      };
    },
  });

  // Start the gql server
  await gqlServer.start();

  return gqlServer;
}

export default createApolloGraphqlServer;
