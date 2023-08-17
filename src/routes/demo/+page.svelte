<script lang="ts">
	import Token from '$lib/Token.svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import { onMount } from 'svelte';
	import { Stage, Layer, Circle, type KonvaDragTransformEvent } from 'svelte-konva';

	export let data;

	onMount(() => {
		const channel = supabase
			.channel('tokens_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public'
				},
				(payload) => {
					if (payload.eventType === 'INSERT') {
						data.tokens = [...data.tokens, payload.new];
					} else if (payload.eventType === 'DELETE') {
						data.tokens = data.tokens.filter((token) => token.id !== payload.old.id);
					} else if (payload.eventType === 'UPDATE') {
						data.tokens = data.tokens.map((token) => {
							if (token.id === payload.new.id) {
								return payload.new;
							}
							return token;
						});
					}
				}
			)
			.subscribe();

		return () => channel.unsubscribe();
	});

	async function handleTokenDragEnd(ev: KonvaDragTransformEvent, tokenId: number) {
		const { x, y } = ev.detail.target.attrs;
		const { status, error } = await supabase
			.from('tokens')
			.update({
				x,
				y
			})
			.eq('id', tokenId);
	}
</script>

{#if typeof window !== 'undefined'}
	<Stage config={{ width: window.innerWidth, height: window.innerHeight, draggable: true }}>
		<Layer>
			{#each data.tokens as token (token.id)}
				{#if token.x && token.y}
        <Token
					config={{
            fill: "green",
            radius: 50,
            x: token.x,
            y: token.y,
            draggable: true
          }}
					handleDragEnd={(ev) => handleTokenDragEnd(ev, token.id)}
				/>          
        {/if}
			{/each}
		</Layer>
	</Stage>
{/if}
