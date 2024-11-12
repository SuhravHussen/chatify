<script lang="ts">
	import { onMount } from 'svelte';
	import Input from './+input.svelte';
	import { getConversation } from '$lib/graphql/conversations';
	import { user, selectedUser } from '../../store/store';
	import { io } from '$lib/socket';
	import Typing from './+typing.svelte';
	import SingleChat from './+singleChat.svelte';
	import type { iUser } from '$lib/types/user.interface';
	import type { iConvo } from '$lib/types/conversation.interface';
	import { fetchContacts } from '$lib/helpers/fetchContacts';

	// States
	let limit = 0;
	let loading = false;
	let convos: iConvo[] = [];
	let hasMore = true;
	let message = '';
	let userDetails: iUser | null = null;
	let selectedUserDetails: iUser | null = null;
	let typing = false;
	let error = '';
	let container: HTMLElement;
	let isInitialLoad = true;
	let previousHeight = 0;

	// Get user details from store
	user.subscribe((value) => (userDetails = value));

	// Get selected user details from store
	selectedUser.subscribe((value) => (selectedUserDetails = value));

	const scrollToBottom = () => {
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	};

	const maintainScrollPosition = () => {
		if (container && previousHeight) {
			container.scrollTop = container.scrollHeight - previousHeight;
		}
	};

	const fetchData = async () => {
		if (!userDetails?.id || !selectedUserDetails?.id) {
			alert('Something went wrong. Please try again.');
			return;
		}

		loading = true;
		try {
			// Store the current scroll height before fetching
			previousHeight = container?.scrollHeight || 0;

			limit += 10;
			const res = await getConversation(userDetails.id, selectedUserDetails.id, limit);
			hasMore = res.hasMore;
			convos = [...res.conversations.reverse()];

			// After updating convos, handle scroll position
			if (isInitialLoad) {
				// For initial load, scroll to bottom
				setTimeout(scrollToBottom, 0);
				isInitialLoad = false;
			} else {
				// For pagination, maintain position
				setTimeout(maintainScrollPosition, 0);
			}
		} catch (err) {
			console.error('Error fetching data:', err);
			error = 'Failed to load conversations. Please refresh.';
		} finally {
			loading = false;
		}
	};

	$: if (selectedUserDetails!.id) {
		limit = 0;
		isInitialLoad = true;
		fetchData();
		fetchContacts(userDetails!.id);
	}

	// Socket listeners
	onMount(() => {
		io.on('receiveMessage', ({ to, from, message }) => {
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				convos = [...convos, message];
				setTimeout(scrollToBottom, 0);
			}
		});

		io.on('typingStarted', ({ to, from }) => {
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				typing = true;
			}
		});

		io.on('typingStopped', ({ to, from }) => {
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				typing = false;
			}
		});
	});

	const handleScroll = () => {
		if (container.scrollTop === 0 && hasMore && !loading) {
			fetchData();
		}
	};
</script>

<ul
	class="convo-container flex flex-col p-5 w-full gap-6 h-[90svh] overflow-y-auto lg:overflow-y-hidden lg:hover:overflow-y-auto lg:focus:overflow-y-auto lg:active:overflow-y-auto"
	bind:this={container}
	on:scroll={handleScroll}
>
	{#if loading}
		<div class="text-center text-gray-500">Loading...</div>
	{/if}

	{#key convos}
		{#each convos as item, i}
			<SingleChat shouldBind {userDetails} {item} />
		{/each}
	{/key}

	{#if typing}
		<li class="text-left contents">
			<Typing />
		</li>
	{/if}
</ul>

<Input bind:message bind:convos />

<style>
	.convo-container {
		/* scrollbar-width: thin; */
	}

	.convo-container::-webkit-scrollbar {
		width: 5px;
	}

	.convo-container::-webkit-scrollbar-thumb {
		background-color: #ce25c5;
		border-radius: 8px;
	}

	.convo-container::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 8px;
	}

	li {
		padding: 15px;
		padding-top: 130px;
		padding-bottom: 30px;
		box-sizing: border-box;
		transition: 0.2s all;
		font-size: 14px;
	}
</style>
