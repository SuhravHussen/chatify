<script lang="ts">
	// modules
	import { logoutUser } from '$lib/graphql/user';
	import { io } from '$lib/socket';
	import type { iUser } from '$lib/types/user.interface';
	import { selectedUser, user } from '../../../store/store';

	//states
	let userDetails: iUser | null;

	user.subscribe((v) => {
		userDetails = v;
	});

	const closeModal = () => {
		document.getElementById('profile-modal')?.classList.add('hidden');
	};

	const onLogout = async () => {
		try {
			if (!userDetails?.email) return;
			await logoutUser();
			io.emit('userDisconnected', { user: userDetails.email });
			user.set(null);
			selectedUser.set(null);
		} catch (e) {
			console.log(e);
		}
	};
</script>

<div
	id="profile-modal"
	class="relative z-50 hidden"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div class="fixed inset-0 backdrop-blur-sm transition-opacity" />

	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
						>
							<img
								class="w-12 h-12 rounded-full"
								src={`https://robohash.org/${userDetails?.name}`}
								alt=""
							/>
						</div>
						<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
								{userDetails?.name}
							</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">
									Do you want to logout from your account {userDetails?.email} ?
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						on:click={onLogout}
						type="button"
						class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
						>Logout</button
					>
					<button
						on:click={closeModal}
						type="button"
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
						>Cancel</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
