<script lang="ts">
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { firebaseAuth } from '$lib';
	import { signInUser } from '$lib/graphql/user';
	import { user as userData } from '../../store/store';
	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const userCredential = await signInWithPopup(firebaseAuth, provider);
			const user = userCredential.user;

			const variables = {
				name: user.displayName,
				email: user.email
			};
			let data = await signInUser(variables.name!, variables.email!);
			data = data.data.createUser;
			userData.set({
				name: data.name,
				email: data.email,
				id: data.id,
				lastLogin: data.lastLogin,
				active: data.active
			});
		} catch (error) {
			console.error('Google login error:', error);
		}
	};
</script>

<div class="flex min-h-screen min-w-full justify-center items-center">
	<button
		class="p-3 flex justify-center items-center gap-3 border border-cyan-300 rounded-lg cursor-pointer min-w-[200px]"
		on:click={loginWithGoogle}>Sign in with <img src="/google.png" class="h-6 w-6" alt="" /></button
	>
</div>
