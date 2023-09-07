<script lang="ts">
	// modules
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { user as userDetails, selectedUser } from '../../../store/store';
	import type { iContact } from '$lib/types/contact.interdace';
	import type { iUser } from '$lib/types/user.interface';

	// This plugin adds relative time functionality
	dayjs.extend(relativeTime);

	//props
	export let contact: iContact;

	//states
	let userId = '';
	let user: iUser | null;
	let timeAgo = '';

	// Get the user details from the store
	userDetails.subscribe((value) => {
		userId = value?.id ? value.id : '';
	});

	$: {
		if (contact) {
			if (contact.lastConversation.sender.id === userId) {
				user = contact.lastConversation.receiver;
			} else {
				user = contact.lastConversation.sender;
			}

			timeAgo = dayjs(contact.lastConversation.createdAt).fromNow();
		}
	}

	const handleSelectUser = () => {
		selectedUser.set(user);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={handleSelectUser}
	class="flex justify-between w-full border-b pb-2 pt-2 dark:border-gray-500 pr-4 cursor-pointer"
>
	<div class="flex items-center gap-[8px]">
		<div class="relative h-10 w-10 rounded-full">
			<img loading="lazy" src={`https://robohash.org/${user?.name}`} alt="" class="rounded-full" />
			{#if user?.active}
				<span
					class="bottom-0 left-7 absolute w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full z-40"
				/>
			{/if}
		</div>

		<div class="flex flex-col w-[200px]">
			<h3 class="truncate font-bold">{user?.name}</h3>
			<p class="text-slate-500 truncate">
				{contact ? contact.lastConversation.text : ''}
			</p>
		</div>
	</div>
	<div>
		<p class="text-xs">{timeAgo}</p>
	</div>
</div>
