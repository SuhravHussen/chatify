<script lang="ts">
	import { getContacts } from '$lib/graphql/contacts';
	import { createConversation } from '$lib/graphql/conversations';
	import { fetchContacts } from '$lib/helpers/fetchContacts';
	import { io } from '$lib/socket';
	import type { iConvo } from '$lib/types/conversation.interface';
	import type { iUser } from '$lib/types/user.interface';
	import { contacts, selectedUser, user } from '../../store/store';
	import { v4 as uuidv4 } from 'uuid';

	// props
	export let message: string;

	export let convos: iConvo[];

	//states
	let selectedUserDetails: iUser | null;
	let userDetails: iUser | null;

	selectedUser.subscribe((value) => {
		selectedUserDetails = value;
	});
	user.subscribe((value) => {
		userDetails = value;
	});

	const onSend = async (id: string) => {
		try {
			if (!message) return;
			if (!selectedUserDetails?.id || !userDetails?.id) {
				alert('something is wrong');
				return;
			}

			const date = new Date();
			let convo = {
				text: message,
				sender: userDetails,
				receiver: selectedUserDetails,
				createdAt: date.toString(),
				id
			};
			console.log(message);
			convos = [convo, ...convos];
			console.log(convos);
			const res = await createConversation(message, selectedUserDetails.id, userDetails.id);
			io.emit('sendMessage', {
				message: res,
				from: userDetails.id,
				to: selectedUserDetails.id
			});

			fetchContacts(userDetails.id);
			message = '';
		} catch (error) {
			console.log(error);
			const index = convos.findIndex((c) => c.id === id);
			if (index !== -1) {
				convos[index].error = true;
			}
			console.log(error);
		}
	};

	let typingTimer: any = null;
	const handleTyping = () => {
		// Emit a 'typingStarted' event immediately
		io.emit('typingStarted', { from: userDetails?.id, to: selectedUserDetails?.id });

		// Clear any previous timer
		clearTimeout(typingTimer);

		typingTimer = setTimeout(() => {
			io.emit('typingStopped', { from: userDetails?.id, to: selectedUserDetails?.id });
		}, 2000);
	};
</script>

<div class="flex w-full p-5 items-center gap-5 h-[90px]">
	<input
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				onSend(uuidv4());
			}
		}}
		on:input={handleTyping}
		bind:value={message}
		placeholder="type your text here"
		type="text"
		class="grow rounded-md h-8 p-6 bg-dark-blue border border-cyan-600"
	/>
	<button on:click={() => onSend(uuidv4())} class="h-10 w-10"><img src="/send.png" alt="" /></button
	>
</div>
