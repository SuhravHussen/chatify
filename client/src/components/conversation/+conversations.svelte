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
	import { fetchContacts } from '$lib/helpers/fetchContacts';

	// states
	let limit = 0;
	let loading = false;
	$: convos = [] as iConvo[];
	let hasMore = true;
	let message = '';
	let userDetails: iUser | null;
	let selectedUserDetails: iUser | null;
	let prvInd = 9;
	let typing = false;
	let lastConvoElement: any;
	let error = '';
	//get user details from store
	user.subscribe((value) => {
		userDetails = value;
	});

	//get selected user details from store
	selectedUser.subscribe((value) => {
		selectedUserDetails = value;
	});

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

	$: {
		if (selectedUserDetails!.id) {
			limit = 0;
			fetchData();
			console.log('getting called');
			fetchContacts(userDetails!.id);
		}
	}

	$: {
		if (lastConvoElement) {
			lastConvoElement.scrollIntoView();
		}
	}

	//  socket listeners
	onMount(() => {
		io.on('receiveMessage', ({ to, from, message }) => {
			if (to === userDetails?.id && from === selectedUserDetails?.id) {
				convos = [message, ...convos];
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
</script>

<ul
	class="flex flex-col p-5 w-full gap-6 max-h-[calc(100vh-180px)] overflow-y-auto lg:overflow-y-hidden convo-container lg:hover:overflow-y-auto lg:focus:overflow-y-auto lg:active:overflow-y-auto min-h-[calc(100vh-180px)]"
>
	{#key convos}
		{#each convos.reverse() as item, i}
			{#if i === prvInd + 1 || i === prvInd}
				<SingleChat i={i.toString()} shouldBind {userDetails} bind:lastConvoElement {item} />
			{:else}
				<SingleChat i={i.toString()} {userDetails} bind:lastConvoElement {item} />
			{/if}
		{/each}
	{/key}
	{#if typing}
		<li class="text-left contents">
			<Typing />
		</li>
	{/if}
	<InfiinityScroll reverse {hasMore} threshold={100} on:loadMore={() => fetchData()} />

	{#if loading}
		<h1>loading...</h1>
	{/if}
</ul>

<Input bind:message bind:convos />

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
