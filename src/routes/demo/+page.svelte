<script lang="ts">
	import { supabase } from '$lib/supabaseClient.js';
	import { onMount } from 'svelte';
	import { Stage, Layer, Circle, type KonvaDragTransformEvent } from 'svelte-konva';

	export let data;

	let tokenConfigs = {};
	let tokenHandles = {};

	$: {
		for (let i = 0; i < data.tokens.length; i++) {
			const token = data.tokens[i];
			const tokenConfig = tokenConfigs[token.id];

			if (tokenConfig) {
				if (token.x !== tokenConfig.x || token.y !== tokenConfig.y) {
          tokenHandles[token.id].to({
            x: token.x,
            y: token.y,
            duration: 0.5
          });
				}
			} else {
        console.log("resetting");
        
        tokenConfigs[token.id] = {
          x: token.x,
          y: token.y,
          radius: 50,
          fill: 'green',
          draggable: true
        }
      }
		}
	}

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
					console.log(payload);

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

	async function handleDragEnd(ev: KonvaDragTransformEvent, tokenId: string) {
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
				<Circle
					config={tokenConfigs[token.id]}
          bind:handle={tokenHandles[token.id]}
					staticConfig
					on:dragend={(ev) => handleDragEnd(ev, token.id)}
				/>
			{/each}
		</Layer>
	</Stage>
{/if}
