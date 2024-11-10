<script lang="ts">
	// modules
	import '../app.css';
	import Chatlist from '../components/layout/chats/+chatlist.svelte';
	import Dashbar from '../components/layout/+dashbar.svelte';
	import AddContact from '../components/layout/modal/+add-contact.svelte';
	import { user } from '../store/store';
	import Signup from '../components/auth/+signup.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/graphql/user';
	import Profile from '../components/layout/modal/+profile.svelte';
	import type { iUser } from '$lib/types/user.interface';

	// states
	let userDetails: iUser | null;
	$: load = true;

	user.subscribe((value) => {
		userDetails = value;
	});

	// check if user is logged in or not
	onMount(() => {
		const checkLoginStatus = async () => {
			load = true;
			return await checkAuth();
		};

		checkLoginStatus().then((res) => {
			if (res && res.id) {
				user.set({
					id: res.id,
					name: res.name,
					email: res.email,
					lastLogin: res.lastLogin,
					active: res.active
				});
			} else {
				user.set(null);
			}
			load = false;
		});
	});
</script>

<div class="bg-amber-50 dark:text-gray-300 dark:bg-dark-blue min-h-screen flex relative">
	{#if userDetails && userDetails.id && !load}
		<AddContact />
		<Profile />
		<Dashbar />
		<Chatlist />
		<slot />
	{:else if !load}
		<Signup />
	{:else}
		<p class="absolute top-1/2 left-1/2">Loading...</p>
	{/if}
</div>
