<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Presence from '$lib/Presence.svelte';
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<nav class="navbar">
	<strong>CrappyTable</strong>
	<div class="menu">
		{#if session?.user}
			<span>Logged in as {session.user.email}</span>
			<button
				on:click={() => {
					supabase.auth.signOut();
				}}>Sign out</button
			>
		{:else}
			<button
				on:click={async () => {
					const { data, error } = await supabase.auth.signInWithOAuth({
						provider: 'discord'
					});
					console.log({
						data,
						error
					});
				}}>Sign in with Discord</button
			>
		{/if}
	</div>
</nav>
{#if session?.user}
	<Presence {supabase} {session} />
{/if}
<main>
	<slot />
</main>

<style>
	.navbar {
		display: flex;
		gap: 8px;
		justify-content: space-between;
		background-color: slategrey;
		padding: 16px;
	}

	.navbar .menu {
		display: flex;
		gap: 8px;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 16px;
	}
</style>
