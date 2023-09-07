<script lang="ts">
	//modules
	import { searchUser } from '$lib/graphql/user';
	import { selectedUser } from '../../../store/store';
	import type { iUser } from '$lib/types/user.interface';

	//states
	let email = '';
	let error = '';
	$: userFound = null as unknown as iUser;

	const onSearch = async () => {
		error = '';
		if (email === '') {
			error = 'Please enter an email';
			return;
		}

		const user = await searchUser(email);

		userFound = user;
	};

	const onSelectUser = () => {
		selectedUser.set(userFound);
		document.getElementById('myModal')?.classList.add('hidden');
		document.getElementById('modalOverlay')?.classList.remove('flex');
	};
</script>

<div id="myModal" class="modal fixed inset-0 flex items-center justify-center z-50 hidden">
	<div id="modalOverlay" class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

	<div
		class="modal-container bg-white dark:bg-black daw-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
	>
		<!-- Add your modal content here -->
		<div class="modal-content py-4 text-left px-6 flex flex-col gap-4">
			<div class="flex justify-between items-center pb-3">
				<p class="text-2xl font-bold">Search user</p>
			</div>
			<input
				placeholder="example@email.com"
				type="text"
				class="ml-auto mr-auto bg-slate-100 p-2 text-dark-blue"
				bind:value={email}
			/>
			{#if userFound !== null}
				<div class="flex gap-2 justify-between">
					<p class="text-lg font-bold">{userFound.name}</p>
					<button on:click={onSelectUser} class="bg-cyan-700 px-3 rounded-lg">add</button>
				</div>
			{/if}

			<button on:click={onSearch} class="bg-cyan-500 hover:bg-cyan-600 text-white rounded-md p-2"
				>Search</button
			>
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
		</div>
	</div>
</div>
