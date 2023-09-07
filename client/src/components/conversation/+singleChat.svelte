<script lang="ts">
	import type { iConvo } from '$lib/types/conversation.interface';
	import type { iUser } from '$lib/types/user.interface';
	import dayjs from 'dayjs';

	export let lastConvoElement;
	export let item: iConvo;
	export let userDetails: iUser | null;
	export let shouldBind = false;

	export let i: string;

	function formatTimestamp(timestamp: string) {
		return dayjs(timestamp).format('MMMM D, YYYY h:mm A');
	}
</script>

{#if shouldBind}
	<li
		class={`${
			item.sender.id === userDetails?.id ? 'text-right' : 'text-left'
		} contents max-w-[50%]`}
	>
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
				class={` rounded-xl p-2 text-white${
					item.sender.id === userDetails?.id
						? 'ml-auto bg-sky-500 '
						: 'mr-auto bg-slate-800 text-white'
				}`}
			>
				{item.text}
			</p>

			{#if !item.error}
				<small>{formatTimestamp(item.createdAt)}</small>
			{:else}
				<small class="text-red-500">Sorry this message could not be send</small>
			{/if}
		</div>
	</li>
{:else}
	<li
		class={`${
			item.sender.id === userDetails?.id ? 'text-right' : 'text-left'
		} contents max-w-[50%]`}
	>
		<div
			class={`flex flex-col gap-1  rounded-md p-2 ${
				item.sender.id === userDetails?.id ? 'ml-auto' : 'mr-auto'
			}`}
		>
			{#if userDetails?.id !== item.sender.id}
				<p class="text-xs">{item.sender.name}</p>
			{/if}
			<p
				class={` rounded-xl p-2 text-white${
					item.sender.id === userDetails?.id
						? 'ml-auto bg-sky-500 '
						: 'mr-auto bg-slate-800 text-white'
				}`}
			>
				{item.text}
			</p>

			{#if !item.error}
				<small>{formatTimestamp(item.createdAt)}</small>
			{:else}
				<small class="text-red-500">Sorry this message could not be send</small>
			{/if}
		</div>
	</li>
{/if}
