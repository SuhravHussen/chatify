import { PUBLIC_BASE_URL } from '$env/static/public';

export const signInUser = async (name: string, email: string) => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `
          mutation CreateUser($name: String!, $email: String!) {
            createUser(name: $name, email: $email) {
              email
              id
              name
              lastLogin
              active
            }
          }
        `,
			variables: {
				name: name,
				email: email
			},
			operationName: 'CreateUser'
		})
	});
	const data = await res.json();
	return data;
};

export const checkAuth = async () => {
	try {
		const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
				query CheckAuth {
					checkAuth {
					  id
					  email
					  active
					  lastLogin
					  name
					}
				  }
				  
			`,
				operationName: 'CheckAuth'
			})
		});
		const data = await res.json();
		return data.data.checkAuth;
	} catch (e) {
		return false;
	}
};

export const searchUser = async (search: string) => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `
			query GetUserByEmail($email: String!) {
				getUserByEmail(email: $email) {
				  email
				  id
				  lastLogin
				  name
				  active
				}
			  }
			  
		`,
			variables: {
				email: search
			},
			operationName: 'GetUserByEmail'
		})
	});
	const data = await res.json();
	return data.data.getUserByEmail;
};

export const logoutUser = async () => {
	const res = await fetch(`${PUBLIC_BASE_URL}/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({
			query: `	
				query Logout {
					logout
  				}		  
		`,

			operationName: 'Logout'
		})
	});
	const data = await res.json();
	console.log(data);
	return data.data.logout;
};
