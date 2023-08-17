<script lang="ts">
	import type { RealtimeChannel, RealtimePresenceState, Session, SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from './database.types';
	import { onMount } from 'svelte';

	export let supabase: SupabaseClient<Database>;
	export let session: Session;

	let channel: RealtimeChannel;
  let presenceState: RealtimePresenceState;
  let onlineUsers = [];

	onMount(() => {
		channel = supabase.channel('users', {
      config: {
        presence: {
          key: session.user.id
        }
      }
    });

		channel
			.on('presence', { event: 'sync' }, () => {
				const newState = channel.presenceState();
				console.log('sync', newState);
        presenceState = channel.presenceState();
			})
			.on('presence', { event: 'join' }, ({ key, newPresences, currentPresences }) => {
				console.log('join', key, newPresences);
        presenceState = channel.presenceState();
			})
			.on('presence', { event: 'leave' }, ({ key, leftPresences, currentPresences }) => {
				console.log('leave', key, leftPresences);
        presenceState = channel.presenceState();
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					const presenceTrackStatus = await channel.track({
						user_id: session.user.id,
            user_email: session.user.email,
						online_at: new Date().toISOString()
					});
					console.log(presenceTrackStatus);
				}
			});

		return () => {
      channel.unsubscribe();
    };
	});

  $: {
    const newOnlineUsers = [];
    for (const presenceKey in presenceState) {
      const state = presenceState[presenceKey][0];
      console.log(state);
      newOnlineUsers.push(state);
    }
    onlineUsers = newOnlineUsers;
  }

</script>

<div>
  <em>Currently online: {onlineUsers.map(user => user.user_email).join(", ")}</em>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 16;
		padding: 16;
		border: 1px solid gray;
	}
</style>
