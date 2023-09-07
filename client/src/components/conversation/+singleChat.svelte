<script lang="ts">
	import type { iConvo } from '$lib/types/conversation.interface';
	import type { iUser } from '$lib/types/user.interface';
	import dayjs from 'dayjs';

	export let lastConvoElement;
	export let item: iConvo;
	export let userDetails: iUser | null;
	export let shouldBind = false;

	function formatTimestamp(timestamp: string) {
		return dayjs(timestamp).format('MMMM D, YYYY h:mm A');
	}
</script>

{#if shouldBind}
	<li class={`${item.sender.id === userDetails?.id ? 'text-right' : 'text-left'} contents`}>
		<div
			bind:this={lastConvoElement}
			class={`flex flex-col gap-1  rounded-md p-2 ${
				item.sender.id === userDetails?.id ? 'ml-auto' : 'mr-auto'
			}`}
		>
			{#if userDetails?.id !== item.sender.id}
				<p class="text-xs">{item.sender.name}</p>
			{/if}
			<p
				class={` rounded-md p-2 text-white${
					item.sender.id === userDetails?.id
						? 'ml-auto bg-sky-500 '
						: 'mr-auto bg-slate-800 text-white'
				}`}
			>
				{item.text}
			</p>

			<small>{formatTimestamp(item.createdAt)}</small>
		</div>
	</li>
{:else}
	<li class={`${item.sender.id === userDetails?.id ? 'text-right' : 'text-left'} contents`}>
		<div
			class={`flex flex-col gap-1  rounded-md p-2 ${
				item.sender.id === userDetails?.id ? 'ml-auto' : 'mr-auto'
			}`}
		>
			{#if userDetails?.id !== item.sender.id}
				<p class="text-xs">{item.sender.name}</p>
			{/if}
			<p
				class={` rounded-md p-2 text-white${
					item.sender.id === userDetails?.id
						? 'ml-auto bg-sky-500 '
						: 'mr-auto bg-slate-800 text-white'
				}`}
			>
				{item.text}
			</p>

			<small>{formatTimestamp(item.createdAt)}</small>
		</div>
	</li>
{/if}
