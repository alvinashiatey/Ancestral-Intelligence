<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut, quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import Pattern01 from '$lib/components/patterns/Pattern01.svelte';
	import Pattern02 from '$lib/components/patterns/Pattern02.svelte';
	import Pattern03 from '$lib/components/patterns/Pattern03.svelte';

	const {
		title,
		onClose,
		peekWidth = 'clamp(28px, 5vw, 72px)',
		backgroundColor = '#6f5453',
		children
	} = $props<{
		title: string;
		onClose?: () => void;
		peekWidth?: string;
		backgroundColor?: string;
		children?: Snippet;
	}>();

	const patternComponents = [Pattern01, Pattern02, Pattern03] as const;
	let activePatternIndex = $state(0);
	const ActivePattern = $derived(patternComponents[activePatternIndex]);

	onMount(() => {
		activePatternIndex = Math.floor(Math.random() * patternComponents.length);
	});
</script>

<div class="overlay" style={`--peek-width: ${peekWidth}; --panel-bg: ${backgroundColor};`}>
	<button
		type="button"
		class="overlay-hit"
		onclick={onClose}
		aria-label={`Close ${title} panel`}
		in:fade={{ duration: 220 }}
		out:fade={{ duration: 180 }}
	></button>
	<div
		class="panel"
		role="dialog"
		aria-modal="true"
		aria-labelledby="panel-title"
		in:fly={{ x: 360, duration: 760, easing: quintOut, opacity: 1 }}
		out:fly={{ x: 90, duration: 360, easing: cubicInOut, opacity: 1 }}
	>
		<div class="panel-pattern" aria-hidden="true">
			<ActivePattern color="#ffffff" fit="slice" />
		</div>
		<header class="panel-head">
			<h2 id="panel-title">{title}</h2>
			<button type="button" class="close" onclick={onClose} aria-label={`Close ${title} panel`}>
				Close
			</button>
		</header>
		<div class="panel-body">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 20;
		pointer-events: none;
		overflow: clip;
	}

	.overlay-hit {
		position: absolute;
		inset: 0;
		padding: 0;
		border: 0;
		background: color-mix(in oklab, #000 20%, transparent);
		cursor: pointer;
		pointer-events: auto;
	}

	.panel {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: var(--peek-width);
		display: grid;
		grid-template-rows: auto 1fr;
		background: var(--panel-bg);
		color: #f4efe6;
		border-left: 1px solid color-mix(in oklab, #f4efe6 22%, transparent);
		box-shadow: -28px 0 52px color-mix(in oklab, #000 16%, transparent);
		pointer-events: auto;
		overflow: hidden;
	}

	.panel-pattern {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.025;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem var(--padding-main-block, 2rem);
		background-color: 2px solid var(--panel-bg);
		position: relative;
		z-index: 1;
	}

	.panel-body {
		overflow-y: auto;
		padding: var(--padding-main-block, 2rem);
		position: relative;
		z-index: 1;
	}

	.close {
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.panel {
			left: clamp(16px, 5vw, 32px);
		}
	}
</style>
