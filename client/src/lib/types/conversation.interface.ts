import type { iUser } from './user.interface';

export interface iConvo {
	text: string;
	sender: iUser;
	receiver: iUser;
	createdAt: string;
	error?: boolean;
	id?: string;
}
