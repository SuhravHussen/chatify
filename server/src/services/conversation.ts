import { GraphQLError } from "graphql";
import { prismaClient } from "../lib/db";

interface conversationPayload {
  text: string;
  receiver: string;
  sender: string;
}

class conversationService {
  public static async createConversation(payload: conversationPayload) {
    const { text, receiver, sender } = payload;

    if (!text || !receiver || !sender)
      throw new GraphQLError("Invalid payload", {
        extensions: {
          code: 400,
        },
      });

    const existingConversation = await prismaClient.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [
              { senderId: parseInt(sender) },
              { receiverId: parseInt(receiver) },
            ],
          },
          {
            AND: [
              { senderId: parseInt(receiver) },
              { receiverId: parseInt(sender) },
            ],
          },
        ],
      },
    });

    if (!existingConversation) {
      const conversation = await prismaClient.conversation.create({
        data: {
          text,
          senderId: parseInt(sender),
          receiverId: parseInt(receiver),
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      const contact = await this.createContact(
        sender,
        receiver,
        conversation.id
      );

      await this.updateConversation(contact.id.toString(), conversation.id);

      return conversation;
    } else {
      const conversation = await prismaClient.conversation.create({
        data: {
          text,
          senderId: parseInt(sender),
          receiverId: parseInt(receiver),
          contactId: existingConversation.contactId,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      await this.updateContact(
        existingConversation.contactId!.toString(),
        conversation.id
      );

      return conversation;
    }
  }

  private static async updateConversation(contactId: string, id: number) {
    const conversation = await prismaClient.conversation.update({
      where: {
        id: id,
      },
      data: {
        contactId: parseInt(contactId),
      },
    });

    return conversation;
  }

  public static async getConversations(
    receiver: string,
    sender: string,
    take: number
  ) {
    const conversations = await prismaClient.conversation.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                receiverId: parseInt(receiver),
              },
              {
                senderId: parseInt(sender),
              },
            ],
          },
          {
            AND: [
              {
                receiverId: parseInt(sender),
              },
              {
                senderId: parseInt(receiver),
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt in descending order (new messages first)
      },
      take: take,
      include: {
        sender: true,
        receiver: true,
      }, // Include the sender and receiver relationships
    });

    const length = await prismaClient.conversation.count();
    const hasMore = length > take;

    return {
      conversations,
      hasMore,
    };
  }

  public static async getContacts(userId: string) {
    const contacts = await prismaClient.contact.findMany({
      where: {
        OR: [
          {
            userOneId: parseInt(userId),
          },
          {
            userTwoId: parseInt(userId),
          },
        ],
      },
      include: {
        userOne: true,
        userTwo: true,
        lastConversation: {
          include: {
            sender: true,
            receiver: true,
          },
        },
      },
      orderBy: {
        lastConversation: {
          createdAt: "desc", // This sorts by createdAt field in descending order (newest to oldest)
        },
      },
    });

    return contacts;
  }

  private static async createContact(
    userOne: string,
    userTwo: string,
    convoId: any
  ) {
    const contact = await prismaClient.contact.create({
      data: {
        userOneId: parseInt(userOne),
        userTwoId: parseInt(userTwo),
        conversationId: convoId,
      },
    });

    return contact;
  }

  private static async updateContact(contactId: string, lastConversation: any) {
    const contact = await prismaClient.contact.update({
      where: {
        id: parseInt(contactId),
      },
      data: {
        conversationId: lastConversation,
      },
    });

    return contact;
  }
}

export default conversationService;
