import { PUBLIC_BASE_URL } from '$env/static/public';

export const getConversation = async (userOne: string, userTwo: string, limit: number) => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `
      query GetConversations($userOne: String!, $userTwo: String!, $take: Int!) {
        getConversations(receiver: $userOne, sender: $userTwo, take: $take) {
          hasMore
          conversations {
            receiver {
              active
              email
              id
              name
              lastLogin
            }
            sender {
              id
              email
              active
              lastLogin
              name
            }
            text
          }
        }
      }
        `,
			operationName: 'GetConversations',
			variables: {
				userOne: userOne,
				userTwo: userTwo,
				take: limit
			}
		})
	});
	const data = await res.json();

	return data.data.getConversations;
};

export const createConversation = async (text: string, receiver: string, sender: string) => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `
      mutation CreateConversation($text: String!, $receiver: String!, $sender: String!) {
        createConversation(text: $text, receiver: $receiver, sender: $sender) {
          text
          sender {
            active
            email
            id
            lastLogin
            name
          }
          receiver {
            active
            email
            id
            lastLogin
            name
          }
        }
      }
      
        `,
			operationName: 'CreateConversation',
			variables: {
				text: text,
				receiver: receiver.toString(),
				sender: sender.toString()
			}
		})
	});
	const data = await res.json();

	return data.data.createConversation;
};
