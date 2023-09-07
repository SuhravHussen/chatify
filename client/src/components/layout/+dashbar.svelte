<script lang="ts">
	// modules
	import { onMount } from 'svelte';
	import { user } from '../../store/store';
	import type { iUser } from '$lib/types/user.interface';

	//states
	let userDetails: iUser | null;

	user.subscribe((v) => {
		userDetails = v;
	});
	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
	});

	function handleOutsideClick(event: any) {
		if (window.innerWidth <= 1020) {
			const dashboard = document.getElementById('dashboard');
			if (event.target.id === 'menu' || dashboard?.contains(event.target)) {
				return;
			}
			if (dashboard) {
				dashboard.classList.add('hidden');
				dashboard.classList.remove('flex');
			}
		}
	}

	const changeTheme = () => {
		var htmlTag = document.querySelector('html');

		// Check if the "dark" class exists
		if (htmlTag && htmlTag.classList.contains('dark')) {
			// Remove the "dark" class
			htmlTag.classList.remove('dark');
		} else {
			// Add the "dark" class
			htmlTag && htmlTag.classList.add('dark');
		}
	};

	const openProfileModal = () => {
		document.getElementById('profile-modal')?.classList.remove('hidden');
	};
</script>

<div
	id="dashboard"
	class=" hidden lg:flex flex-col w-24 items-center border-r dark:border-indigo-500 lg:relative absolute left-0 top-0 h-screen bg-inherit z-40"
>
	<div class="p-2 mb-4 h-14 w-14 mt-2">
		<img src="/chatbot.png" alt="" />
	</div>
	<div class="p-2 h-12 w-12 dark:bg-indigo-800 rounded-xl cursor-pointer relative group">
		<img src="/chat.png" alt="" />
		<div
			class="bg-gray-200 text-black p-2 rounded absolute hidden top-0.5 left-16 group-hover:block"
		>
			chats
		</div>
	</div>

	<div class="p-2 h-12 w-12 absolute bottom-20 cursor-pointer group">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img src="/moon.png" alt="" on:click={changeTheme} />
		<div class="bg-gray-200 text-black p-2 rounded absolute hidden top-1 left-14 group-hover:block">
			Theme
		</div>
	</div>

	<button on:click={openProfileModal} class="p-2 h-12 w-12 absolute bottom-5 cursor-pointer group">
		<img class="rounded-full" src={`https://robohash.org/${userDetails?.name}`} alt="" />
		<div class="bg-gray-200 text-black p-2 rounded absolute hidden top-1 left-14 group-hover:block">
			Logout
		</div>
	</button>
</div>

<style>
	#dashboard {
		max-height: 100svh;
		overflow: hidden;
	}
</style>
