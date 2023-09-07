<script lang="ts">
	import { getContacts } from '$lib/graphql/contacts';
	import { createConversation } from '$lib/graphql/conversations';
	import { io } from '$lib/socket';
	import type { iConvo } from '$lib/types/conversation.interface';
	import type { iUser } from '$lib/types/user.interface';
	import { contacts, selectedUser, user } from '../../store/store';

	// props
	export let message: string;
	export let addConvos: (convo: iConvo) => void;

	//states
	let selectedUserDetails: iUser | null;
	let userDetails: iUser | null;

	selectedUser.subscribe((value) => {
		selectedUserDetails = value;
	});
	user.subscribe((value) => {
		userDetails = value;
	});

	const onSend = async () => {
		try {
			if (!message) return;
			if (!selectedUserDetails?.id || !userDetails?.id) {
				alert('something is wrong');
				return;
			}
			const res = await createConversation(message, selectedUserDetails.id, userDetails.id);
			io.emit('sendMessage', {
				message: res,
				from: userDetails.id,
				to: selectedUserDetails.id
			});
			addConvos(res);
			const contactsList = await getContacts(userDetails.id);

			contacts.set(contactsList);
			message = '';
		} catch (error) {
			console.log(error);
		}
	};

	let typingTimer: any = null;
	const handleTyping = () => {
		// Emit a 'typingStarted' event immediately
		io.emit('typingStarted', { from: userDetails?.id, to: selectedUserDetails?.id });

		// Clear any previous timer
		clearTimeout(typingTimer);

		// Set a new timer to send a 'typingStopped' event after, let's say, 2000 milliseconds (2 seconds)
		typingTimer = setTimeout(() => {
			io.emit('typingStopped', { from: userDetails?.id, to: selectedUserDetails?.id });
		}, 2000); // Adjust the timeout as needed
	};
</script>

<div class="flex w-full p-5 items-center gap-5">
	<input
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				onSend();
			}
		}}
		on:input={handleTyping}
		bind:value={message}
		placeholder="type your text here"
		type="text"
		class="grow rounded-md h-8 p-6 bg-dark-blue border border-cyan-600"
	/>
	<button on:click={onSend} class="h-10 w-10"><img src="/send.png" alt="" /></button>
</div>
