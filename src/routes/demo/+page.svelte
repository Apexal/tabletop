<script lang="ts">
	import Token from '$lib/Token.svelte';
	import { supabase } from '$lib/supabaseClient.js';
	import { onMount } from 'svelte';
	import { Stage, Layer, Circle, type KonvaDragTransformEvent, Line } from 'svelte-konva';

	export let data;

	const gridCellSize = 50;
	const gridTotalHeight = gridCellSize * 20;
	const gridTotalWidth = gridCellSize * 30;

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

	async function handleTokenMoveTo(tokenId: number, pos: { x: number; y: number }) {
		const { status, error } = await supabase
			.from('tokens')
			.update({
				x: Math.round(pos.x),
				y: Math.round(pos.y)
			})
			.eq('id', tokenId);
	}
</script>

{#if typeof window !== 'undefined'}
	<Stage config={{ width: window.innerWidth, height: window.innerHeight, draggable: true }}>
		<Layer
			config={{
				id: 'grid',
				draggable: false
			}}
		>
			{#each { length: Math.round(gridTotalHeight / gridCellSize + 1) } as _, index}
				<Line
					config={{
						stroke: 'black',
						points: [0, index * gridCellSize, gridTotalWidth, index * gridCellSize]
					}}
				/>
			{/each}

			{#each { length: Math.round(gridTotalWidth / gridCellSize + 1) } as _, index}
				<Line
					config={{
						stroke: 'black',
						points: [index * gridCellSize, 0, index * gridCellSize, gridTotalHeight]
					}}
				/>
			{/each}
		</Layer>
		<Layer>
			{#each data.tokens as token (token.id)}
				{#if token.x !== null && token.y !== null}
					<Token
						{gridCellSize}
						config={{
							fill: 'green',
							radius: gridCellSize,
							x: Math.round(token.x),
							y: Math.round(token.y),
							draggable: true
						}}
						on:moveTo={(ev) => handleTokenMoveTo(token.id, ev.detail)}
					/>
				{/if}
			{/each}
		</Layer>
	</Stage>
{/if}
