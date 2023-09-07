<script lang="ts">
	import { selectedUser } from '../../store/store';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { io } from '$lib/socket';
	import { onMount } from 'svelte';
	import type { iUser } from '$lib/types/user.interface';

	dayjs.extend(relativeTime);

	export let user: iUser;

	const handleSelectUser = () => {
		selectedUser.set(null);
	};

	onMount(() => {
		io.on('userUpdated', ({ user }) => {
			if (user.id === user.id) {
				selectedUser.set(user);
			}
		});
	});
</script>

<div class="flex w-full p-5 justify-between items-center border-b dark:border-b-indigo-500">
	<div class="flex justify-center items-center gap-5">
		<button class="text-xl font-bold" on:click={handleSelectUser}>{'<'}</button>

		<div>
			<img class="w-12 h-12 rounded-full" src={`https://robohash.org/${user.name}`} alt="" />
		</div>
		<div class="flex flex-col">
			<h3 class="truncate font-bold">{user.name}</h3>
			{#if user.active}
				<small class="text-green-500">active</small>
			{:else}
				<small>{dayjs(user.lastLogin).fromNow()}</small>
			{/if}
		</div>
	</div>

	<div>...</div>
</div>
