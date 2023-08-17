<script lang="ts">
	import type { CircleConfig } from 'konva/lib/shapes/Circle';
	import { createEventDispatcher } from 'svelte';
	import { Circle, type KonvaDragTransformEvent } from 'svelte-konva';
	import { spring } from 'svelte/motion';

	export let gridCellSize: number;
	export let config: CircleConfig;

	const dispatch = createEventDispatcher();

	const pos = spring(
		{
			x: config.x,
			y: config.y
		},
		{
			stiffness: 0.1,
			damping: 1
		}
	);

	$: {
		pos.set({
			x: config.x,
			y: config.y
		});
	}
</script>

<Circle
	config={{
		...config,
		...$pos
	}}
	on:dragend={(e) => {
		let { x, y } = e.detail.target.attrs;

        // TODO: check bounds

		x = Math.round(x / gridCellSize) * gridCellSize;
		y = Math.round(y / gridCellSize) * gridCellSize;

		pos.set(
			{
				x,
				y
			},
			{
				hard: 1
			}
		);

		dispatch('moveTo', { x, y });
	}}
/>
