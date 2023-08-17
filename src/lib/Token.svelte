<script lang="ts">
	import type { CircleConfig } from 'konva/lib/shapes/Circle';
	import { Circle, type KonvaDragTransformEvent } from 'svelte-konva';
	import { tweened } from 'svelte/motion';

	export let config: CircleConfig;
    let realConfig;
	export let handleDragEnd: (e: KonvaDragTransformEvent) => void;
	const x = tweened(config.x ?? 0);
	const y = tweened(config.y ?? 0);

	$: {
		x.set(config.x ?? 0);
		y.set(config.y ?? 0);
	}

	$: realConfig = {
        ...config,
        x: $x,
        y: $y,
    };
</script>

<Circle config={realConfig} on:dragend={handleDragEnd} />
