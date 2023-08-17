<script lang="ts">
	import type { CircleConfig } from 'konva/lib/shapes/Circle';
	import { Circle, type KonvaDragTransformEvent } from 'svelte-konva';
	import { spring } from 'svelte/motion';

	export let config: CircleConfig;
	export let handleDragEnd: (e: KonvaDragTransformEvent) => void;
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
		const { x, y } = e.detail.target.attrs;
		pos.set(
			{
				x,
				y
			},
			{
				hard: 1
			}
		);
		handleDragEnd(e);
	}}
/>
