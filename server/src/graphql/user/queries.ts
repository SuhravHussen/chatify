export const queries = `#graphql
    getUserToken(email: String!): String
    checkAuth: User 
    getUserByEmail(email: String!): User
    logout: Boolean
`;
