export const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
        active: Boolean!
        createdAt: DateTime!
        lastLogin: DateTime
    }
`;
