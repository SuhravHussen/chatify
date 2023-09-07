<script lang="ts">
	// necessary modules
	import { onMount } from 'svelte';
	import Input from './+input.svelte';
	import { getConversation } from '$lib/graphql/conversations';
	import { user, selectedUser } from '../../store/store';
	import { io } from '$lib/socket';
	import InfiinityScroll from './+InfiinityScroll.svelte';
	import Typing from './+typing.svelte';
	import SingleChat from './+singleChat.svelte';
	import type { iUser } from '$lib/types/user.interface';
	import type { iConvo } from '$lib/types/conversation.interface';

	// states
	let limit = 0;
	let loading = false;
	let convos = [] as iConvo[];
	let hasMore = true;
	let message = '';
	let userDetails: iUser | null;
	let selectedUserDetails: iUser | null;
	let prvInd = 9;
	let typing = false;
	let lastConvoElement: any;

	//get user details from store
	user.subscribe((value) => {
		userDetails = value;
	});

	//get selected user details from store
	selectedUser.subscribe((value) => {
		selectedUserDetails = value;
	});

	const addConvos = (convo: any) => {
		convos = [convo, ...convos];
	};

	const fetchData = async () => {
		if (!userDetails?.id || !selectedUserDetails?.id) {
			alert('something went wrong');
			return;
		}

		limit = limit + 10;

		try {
			const res = await getConversation(userDetails.id, selectedUserDetails.id, limit);
			hasMore = res.hasMore;
			convos = [...convos, ...res.conversations.slice(convos.length, res.conversations.length)];
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		fetchData().then(() => {
			if (lastConvoElement) {
				lastConvoElement.scrollIntoView();
			}
		});
	});

	$: selectedUserDetails: {
		console.log(selectedUserDetails);
	}
	//  socket listeners
	onMount(() => {
		io.on('receiveMessage', ({ to, from, message }) => {
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				convos = [message, ...convos];
			}
		});

		io.on('typingStarted', ({ to, from }) => {
			console.log(to === userDetails?.id && from === selectedUserDetails?.id);
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				typing = true;
			}
		});

		io.on('typingStopped', ({ to, from }) => {
			console.log('typing stopped by', from);
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				typing = false;
			}
		});
	});
</script>

<ul
	class="flex flex-col p-5 w-full gap-6 max-h-[calc(100vh-180px)] overflow-y-hidden convo-container hover:overflow-y-auto focus:overflow-y-auto active:overflow-y-auto min-h-[calc(100vh-180px)]"
>
	{#each convos.slice().reverse() as item, i}
		{#if i === prvInd}
			<SingleChat shouldBind {userDetails} bind:lastConvoElement {item} />
		{:else}
			<SingleChat {userDetails} bind:lastConvoElement {item} />
		{/if}
	{/each}
	{#if typing}
		<li class="text-left contents">
			<Typing />
		</li>
	{/if}
	<InfiinityScroll
		reverse
		{hasMore}
		threshold={100}
		on:loadMore={() =>
			fetchData().then(() => {
				if (lastConvoElement) lastConvoElement.scrollIntoView();
			})}
	/>

	{#if loading}
		<h1>loading...</h1>
	{/if}
</ul>

<Input bind:message {addConvos} />

<style>
	.convo-container {
		scrollbar-width: thin;
	}

	/* Styling for Webkit (Chrome, Safari, newer versions of Edge) */
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
