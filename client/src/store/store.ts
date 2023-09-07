import type { iContact } from '$lib/types/contact.interdace';
import type { iUser } from '$lib/types/user.interface';
import { writable } from 'svelte/store';

export const selectedUser = writable<iUser | null>(null);

export const user = writable<iUser | null>(null);

export const contacts = writable<iContact[]>([]);
