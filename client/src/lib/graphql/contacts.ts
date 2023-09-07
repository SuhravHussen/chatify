import { PUBLIC_BASE_URL } from '$env/static/public';

export const getContacts = async (id: string) => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `
            query GetContacts($user: String!) {
                getContacts(user: $user) {
                  lastConversation {
                    text
                    sender {
                      name
                      email
                      id
                      lastLogin
                      active
                    }
                    receiver {
                      active
                      email
                      id
                      name
                      lastLogin
                    }
                    createdAt
                  }
                }
              }
        `,
			operationName: 'GetContacts',
			variables: {
				user: id
			}
		})
	});
	const data = await res.json();

	return data.data.getContacts;
};
