<script lang="ts">
	//modules
	import { onMount } from 'svelte';
	import SingleUser from './+single-user.svelte';
	import { getContacts } from '$lib/graphql/contacts';
	import { contacts as contactStore, selectedUser, user } from '../../../store/store';
	import { io } from '$lib/socket';
	import type { iUser } from '$lib/types/user.interface';

	//states
	let userDetails: null | iUser;
	let selectedUserDetails: null | iUser;
	$: load = false as Boolean;
	//open or close dashboard on mobile
	const handleMenu = () => {
		const t = document.getElementById('dashboard');
		if (t) {
			t.classList.toggle('hidden');
			t.classList.toggle('flex');
		}
	};

	// Function to close modal on outside click
	function closeModalOnOutsideClick(event: any) {
		const overlay = document.getElementById('modalOverlay');

		if (overlay === event.target) {
			const modal = document.getElementById('myModal');
			if (modal) {
				modal.classList.add('hidden');
				modal.classList.remove('flex');
				document.removeEventListener('click', closeModalOnOutsideClick);
			}
		}
	}

	// open add contacts modal
	const openModal = () => {
		const modal = document.getElementById('myModal');

		if (modal) {
			modal.classList.remove('hidden');
			modal.classList.add('flex');
			document.addEventListener('click', closeModalOnOutsideClick);
		}
	};

	function fetchContacts() {
		getContacts(userDetails!.id)
			.then((res) => {
				contactStore.set(res);
				load = false;
			})
			.catch((err) => {
				console.log(err);
				load = false;
			});
	}

	onMount(() => {
		user.subscribe((value) => {
			userDetails = value;
		});
		selectedUser.subscribe((val) => {
			selectedUserDetails = val;
		});
		load = true;

		fetchContacts();

		io.on('receiveMessage', ({ to }) => {
			if (to === userDetails!.id) {
				fetchContacts();
			}
		});

		io.on('userUpdated', ({ to }) => {
			if (to === userDetails!.id) {
				fetchContacts();
			}
		});
	});
</script>

<div
	class={`flex flex-col z-30  border-r dark:border-violet-600 p-4 grow-0 ${
		selectedUserDetails?.id ? 'hidden lg:flex lg:w-[360px]  p-0' : 'w-full lg:w-[360px] '
	} lg:w-[360px]  `}
>
	<!-- heading -->
	<div class="flex justify-between items-center pl-2 pr-2 pb-6 border-b dark:border-violet-600">
		<!-- left -->
		<div class="flex justify-center items-center gap-2">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				id="menu"
				class="w- h-8 lg:hidden cursor-pointer"
				src="/hamburger.png"
				alt=""
				on:click={handleMenu}
			/>
			<h2 class="text-2xl font-bold">Chats</h2>
		</div>

		<!-- right  -->

		<button on:click={openModal} id="openModal" class="text-4xl cursor-pointer">+</button>
	</div>
	<!-- header end -->

	<!-- chatlist -->
	<div
		id="chat-box"
		class="flex flex-col items-center mt-6 max-h-[calc(100vh-130px)] overflow-y-hidden chat-container hover:overflow-y-auto focus:overflow-y-auto active:overflow-y-auto"
	>
		<!-- chat -->
		{#if load}
			{#each Array.from({ length: 20 }) as _, index}
				<div
					class="flex justify-between w-full border-b pb-2 pt-2 dark:border-gray-500 pr-4 cursor-pointer animate-pulse"
				>
					<div class="flex items-center gap-[8px]">
						<div class="h-10 w-10 rounded-full bg-gray-300" />
						<div class="flex flex-col w-[200px]">
							<h3 class="truncate font-bold bg-gray-300 h-5 w-3/4" />
							<p class="text-slate-500 truncate bg-gray-200 h-4 w-1/2 mt-1" />
						</div>
					</div>
					<div>
						<p class="text-xs bg-gray-200 h-4 w-12" />
					</div>
				</div>
			{/each}
		{/if}
		{#if $contactStore.length > 0}
			{#each $contactStore as contact}
				<SingleUser {contact} />
			{/each}
		{/if}
		<!-- chat end -->
	</div>
	<!-- chat-list end -->
</div>

<style>
	.chat-container {
		scrollbar-width: thin;
	}

	/* Styling for Webkit (Chrome, Safari, newer versions of Edge) */
	.chat-container::-webkit-scrollbar {
		width: 5px;
	}

	.chat-container::-webkit-scrollbar-thumb {
		background-color: #ce25c5;
		border-radius: 8px;
	}

	.chat-container::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 8px;
	}
</style>
