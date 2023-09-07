export const typeDefs = `#graphql
    type Conversation {
        id: ID!
        text: String!
        receiver: User
        sender: User
        createdAt: DateTime!
        receiverId: Int
        senderId: Int
        contactId: Int
    }

    type Contact {
        id: ID!
        userOne: User
        userTwo: User
        userOneId: Int
        userTwoId: Int
        lastConversation: Conversation
        
    }

    type ConversationResponse {
        conversations: [Conversation] ,
        hasMore: Boolean
    }
`;
