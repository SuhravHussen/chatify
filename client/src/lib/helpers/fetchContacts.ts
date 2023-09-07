import { getContacts } from '$lib/graphql/contacts';
import { contacts } from '../../store/store';
export async function fetchContacts(id: string) {
	getContacts(id)
		.then((res) => {
			contacts.set(res);
		})
		.catch((err) => {
			console.log(err);
		});
}
