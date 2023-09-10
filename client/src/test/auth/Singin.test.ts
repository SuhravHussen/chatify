/* eslint-disable @typescript-eslint/no-empty-function */
// NOTE: jest-dom adds handy assertions to Jest (and Vitest) and it is recommended, but not required.
import '@testing-library/jest-dom';

import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Signup from '../../components/auth/+signup.svelte';
import { vi } from 'vitest';
import { signInUser } from '$lib/graphql/user';

vi.mock('$lib', () => {
	return {
		firebaseAuth: () => ''
	};
});

vi.mock('$lib/graphql/user', () => {
	return {
		signInUser: () => {
			const obj = {
				data: {
					createUser: {
						name: 'Suhrav hussen',
						email: 'suhravshan@gmail.com',
						id: '1',
						lastLogin: null,
						active: true
					}
				}
			};
			return obj;
		}
	};
});

vi.mock('firebase/auth', () => {
	return {
		GoogleAuthProvider: vi.fn(),
		signInWithPopup: () => {
			return new Promise((res) =>
				res({
					user: { displayName: 'suhrav  hussen', email: 'suhravshan@gmail.com' }
				})
			);
		}
	};
});

test('Get sign in with  text', () => {
	render(Signup);
	const text = screen.getByText('Sign in with');

	expect(text).toBeInTheDocument();
});

test('wait button appears', async () => {
	render(Signup);

	// Find the "Sign in with" button
	const signInButton = screen.getByText('Sign in with');

	// Simulate a click on the button
	fireEvent.click(signInButton);

	await waitFor(() => {
		const text = screen.getByText('Wait...');
		expect(text).toBeInTheDocument();
	});
});

test('test login function called', () => {
	render(Signup);

	// Find the "Sign in with" button
	const signInButton = screen.getByText('Sign in with');

	const call = vi.spyOn(
		{
			signInUser: signInUser
		},
		'signInUser'
	);
	// Simulate a click on the button
	fireEvent.click(signInButton);

	waitFor(() => {
		expect(call).toHaveBeenCalled();
	});
});
