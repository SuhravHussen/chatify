export const queries = `#graphql
    getConversations(receiver: String!, sender: String! , take: Int!): ConversationResponse
    
    
    getContacts(user: String!): [Contact]
`;
