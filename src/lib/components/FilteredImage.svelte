<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		src,
		alt = '',
		width = '100%',
		height,
		hoverDuration = 450,
		moveStrength = 3,
		caption,
		captionClass = ''
	} = $props<{
		src: string;
		alt?: string;
		width?: string | number;
		height?: string | number;
		hoverDuration?: number;
		moveStrength?: number;
		caption?: string | Snippet;
		captionClass?: string;
	}>();

	const id = `normalmap-${Math.random().toString(36).slice(2, 9)}`;

	let gxOffsetEl: SVGElement | null = null;
	let gyOffsetEl: SVGElement | null = null;

	let tx = 0;
	let ty = 0;
	let cx = 0;
	let cy = 0;
	let raf = 0;

	function applyShift(x: number, y: number) {
		gxOffsetEl?.setAttribute('dx', String(x));
		gyOffsetEl?.setAttribute('dy', String(y));
	}

	function tick() {
		const ease = 0.15;
		cx += (tx - cx) * ease;
		cy += (ty - cy) * ease;
		applyShift(cx, cy);

		const done = Math.abs(tx - cx) < 0.01 && Math.abs(ty - cy) < 0.01;
		raf = done ? 0 : requestAnimationFrame(tick);
	}

	function onpointermove(e: PointerEvent) {
		const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
		const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1

		tx = nx * moveStrength;
		ty = ny * moveStrength;

		if (!raf) raf = requestAnimationFrame(tick);
	}

	function resetShift() {
		tx = 0;
		ty = 0;
		if (!raf) raf = requestAnimationFrame(tick);
	}

	$effect(() => {
		applyShift(0, 0);

		return () => {
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<svelte:window {onpointermove} onblur={resetShift} />

<figure
	class="photo-wrap"
	style={typeof width === 'number' ? `width: ${width}px` : `width: ${width}`}
>
	<div class="photo-inner">
		{#if height}
			<img class="photo original" {src} {alt} {height} />
		{:else}
			<img class="photo original" {src} {alt} />
		{/if}

		<img
			class="photo filtered"
			{src}
			alt=""
			aria-hidden="true"
			style={`filter: url(#${id}); transition: opacity ${hoverDuration}ms cubic-bezier(.22,.9,.35,1)`}
		/>

		<svg width="0" height="0" style="position:absolute" aria-hidden="true">
			<defs>
				<filter {id} x="-20%" y="-20%" width="140%" height="140%">
					<feColorMatrix
						in="SourceGraphic"
						type="matrix"
						values="
							0.2126 0.7152 0.0722 0 0
							0.2126 0.7152 0.0722 0 0
							0.2126 0.7152 0.0722 0 0
							0      0      0      1 0"
						result="height"
					/>

					<feConvolveMatrix
						in="height"
						order="3"
						kernelMatrix="
							-1 0 1
							-2 0 2
							-1 0 1"
						divisor="1"
						bias="0.5"
						result="gx"
					/>

					<feConvolveMatrix
						in="height"
						order="3"
						kernelMatrix="
							-1 -2 -1
							 0  0  0
							 1  2  1"
						divisor="1"
						bias="0.5"
						result="gy"
					/>

					<!-- Mouse-driven movement -->
					<feOffset in="gx" dx="0" dy="0" result="gxMoved" bind:this={gxOffsetEl} />
					<feOffset in="gy" dx="0" dy="0" result="gyMoved" bind:this={gyOffsetEl} />

					<feColorMatrix
						in="gxMoved"
						type="matrix"
						values="
							1 0 0 0 0
							0 0 0 0 0
							0 0 0 0 0
							0 0 0 1 0"
						result="rChan"
					/>

					<feColorMatrix
						in="gyMoved"
						type="matrix"
						values="
							0 0 0 0 0
							1 0 0 0 0
							0 0 0 0 0
							0 0 0 1 0"
						result="gChan"
					/>

					<feFlood flood-color="#8080ff" result="blueFill" />
					<feComposite in="blueFill" in2="SourceAlpha" operator="in" result="bChan" />

					<feBlend in="rChan" in2="gChan" mode="screen" result="rg" />
					<feBlend in="rg" in2="bChan" mode="screen" result="normalRGB" />

					<feComposite in="normalRGB" in2="SourceAlpha" operator="in" />
				</filter>
			</defs>
		</svg>
	</div>
	{#if caption}
		<figcaption class={`caption ${captionClass}`.trim()}>
			{#if typeof caption === 'function'}
				{@render caption()}
			{:else}
				{caption}
			{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.photo-wrap {
		position: relative;
		display: inline-block;
	}

	.photo-inner {
		position: relative;
		display: block;
		overflow: hidden;
	}

	.photo {
		display: block;
		width: 100%;
		height: auto;
		backface-visibility: hidden;
		transform: translateZ(0);
	}

	.photo.original {
		position: relative;
		z-index: 0;
	}

	.photo.filtered {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		will-change: opacity;
		pointer-events: none;
		z-index: 1;
	}

	.photo-inner:hover .photo.filtered {
		opacity: 0;
	}

	.caption {
		margin-top: 0.25rem;
		margin-block-end: 1rem;
		font-size: 0.9rem;
		color: #60d6f5;
		/* text-align: center; */
		position: relative;
		z-index: 2;
	}
</style>
