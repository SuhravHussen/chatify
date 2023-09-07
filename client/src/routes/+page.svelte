<script lang="ts">
	//  modules
	import { onMount } from 'svelte';
	import Conversations from '../components/conversation/+conversations.svelte';
	import Header from '../components/conversation/+header.svelte';
	import NotSelected from '../components/conversation/+not-selected.svelte';
	import { selectedUser, user } from '../store/store';
	import { io } from '$lib/socket';
	import type { iUser } from '$lib/types/user.interface';

	//states
	let selectedUserDetails: iUser | null = null;
	let userDetails: iUser | null = null;

	user.subscribe((v) => {
		userDetails = v;
	});

	selectedUser.subscribe((value) => {
		selectedUserDetails = value;
	});

	onMount(() => {
		io.emit('userConnected', { user: userDetails?.email });
	});

	// if tab close
	function beforeUnload(event: any) {
		// Cancel the event as stated by the standard.
		event.preventDefault();
		// Chrome requires returnValue to be set.
		event.returnValue = '';
		// more compatibility
		io.emit('userDisconnected', { user: userDetails?.email });
		return '...';
	}
</script>

<svelte:window on:beforeunload={beforeUnload} />
<div class="flex flex-col items-center grow min-h-screen max-h-screen justify-center">
	{#if !selectedUserDetails?.id}
		<NotSelected />
	{/if}
	{#if selectedUserDetails?.id}
		<Header user={selectedUserDetails} />
		<Conversations />
	{/if}
</div>
