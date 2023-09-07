import type { iUser } from './user.interface';

export interface iContact {
	lastConversation: {
		text: string;
		sender: iUser;
		receiver: iUser;
		createdAt: string;
	};
}
