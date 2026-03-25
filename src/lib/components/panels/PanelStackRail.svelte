<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { Component } from 'svelte';
	import Pattern01 from '$lib/components/patterns/Pattern01.svelte';
	import Pattern02 from '$lib/components/patterns/Pattern02.svelte';
	import Pattern03 from '$lib/components/patterns/Pattern03.svelte';

	type PanelItem = {
		key: string;
		title: string;
		backgroundColor: string;
		component: Component;
	};

	const {
		items,
		activeKey = null,
		onSelect,
		onClose
	} = $props<{
		items: readonly PanelItem[];
		activeKey?: string | null;
		onSelect?: (key: string) => void;
		onClose?: () => void;
	}>();

	const patterns = [Pattern01, Pattern02, Pattern03] as const;
	let hoveredKey = $state<string | null>(null);
	let patternByKey = $state<Record<string, number>>({});
	let isCollapsing = $state(false);
	let previousActiveKey: string | null = null;
	let collapseTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (activeKey) {
			hoveredKey = null;
		}

		if (previousActiveKey && !activeKey) {
			isCollapsing = true;
			if (collapseTimer) clearTimeout(collapseTimer);
			collapseTimer = setTimeout(() => {
				isCollapsing = false;
			}, 580);
		}

		previousActiveKey = activeKey;

		return () => {
			if (collapseTimer) clearTimeout(collapseTimer);
		};
	});

	onMount(() => {
		const next: Record<string, number> = {};
		for (const item of items) {
			next[item.key] = Math.floor(Math.random() * patterns.length);
		}
		patternByKey = next;
	});

	function panelTransform(index: number, key: string) {
		if (activeKey) {
			if (activeKey === key) return 'translateX(0)';
			return 'translateX(100%)';
		}

		const layer = items.length - 1 - index;
		const base = `calc(100% - var(--tab-peek) - (${layer} * var(--stack-step)))`;
		if (hoveredKey === key) {
			return `translateX(calc(${base} - var(--hover-shift)))`;
		}
		return `translateX(${base})`;
	}

	function panelZ(index: number, key: string) {
		if (activeKey === key) return 50;
		return index + 10;
	}
</script>

<aside
	class={`rail ${isCollapsing ? 'is-collapsing' : ''}`.trim()}
	onmouseleave={() => (hoveredKey = null)}
>
	{#each items as item, index (item.key)}
		{@const isActive = activeKey === item.key}
		{@const Pattern = patterns[patternByKey[item.key] ?? index % patterns.length]}
		<div
			class={`panel-card ${isActive ? 'is-active' : ''}`}
			style={`--panel-bg: ${item.backgroundColor}; transform: ${panelTransform(index, item.key)}; z-index: ${panelZ(index, item.key)};`}
		>
			<div class="pattern-layer" aria-hidden="true">
				<Pattern color="#ffffff" fit="slice" />
			</div>

			{#if !isActive}
				<button
					type="button"
					class="panel-hit"
					aria-label={`Open ${item.title} panel`}
					onmouseenter={() => {
						if (!activeKey) hoveredKey = item.key;
					}}
					onmouseleave={() => {
						if (!activeKey && hoveredKey === item.key) hoveredKey = null;
					}}
					onfocus={() => {
						if (!activeKey) hoveredKey = item.key;
					}}
					onblur={() => {
						if (!activeKey) hoveredKey = null;
					}}
					onclick={() => onSelect?.(item.key)}
				></button>
			{/if}

			<div class="edge-tab">
				<span class="tab-text tab-text-vertical">{item.title}</span>
				<span class="tab-text tab-text-horizontal">{item.title}</span>
			</div>

			{#if isActive}
				{@const Content = item.component}
				<div
					class="panel-content"
					in:fly={{ x: 60, duration: 360, easing: cubicOut }}
					out:fade={{ duration: 180 }}
				>
					<header class="panel-head">
						<h2 class="sr-only">{item.title}</h2>
						<button
							type="button"
							class="close"
							onclick={onClose}
							aria-label={`Close ${item.title} panel`}
						>
							Close
						</button>
					</header>
					<div class="panel-body">
						<Content />
					</div>
				</div>
			{/if}
		</div>
	{/each}
</aside>

<style>
	.rail {
		position: absolute;
		inset: 0;
		overflow: hidden;
		z-index: 22;
		pointer-events: none;
		--tab-peek: clamp(124px, 14vw, 200px);
		--stack-step: clamp(20px, 2.2vw, 34px);
		--hover-shift: clamp(28px, 3.6vw, 56px);
		--active-inset: clamp(28px, 5vw, 72px);
	}

	.panel-card {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		/* background: var(--panel-bg); */
		background-color: #fefefe;
		border-left: 2px solid var(--panel-bg);
		/* box-shadow: -24px 0 44px color-mix(in oklab, #000 14%, transparent); */
		transition:
			transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
			left 420ms cubic-bezier(0.22, 1, 0.36, 1);
		overflow: hidden;
		pointer-events: auto;
	}

	.panel-card.is-active {
		left: var(--active-inset);
		box-shadow: -36px 0 60px color-mix(in oklab, #000 20%, transparent);
	}

	.rail.is-collapsing .panel-card {
		transition-duration: 560ms;
		transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	}

	.pattern-layer {
		position: absolute;
		inset: 0;
		opacity: 0.025;
		pointer-events: none;
	}

	.panel-hit {
		position: absolute;
		inset: 0;
		z-index: 1;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	.edge-tab {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: var(--tab-peek);
		/* display: flex; */
		/* align-items: center; */
		justify-content: flex-start;
		/* padding: 0.75rem 0.25rem 0.75rem 0.35rem; */
		padding-block-start: var(--padding-main-block, 2rem);
		padding-inline: var(--space-1, 1rem);
		border: 0;
		background: transparent;
		color: var(--panel-bg);
		font: inherit;
		line-height: 1.1;
		letter-spacing: 0.06em;
		/* font-size: 0.95rem; */
		pointer-events: none;
		z-index: 2;
		transition:
			top 320ms cubic-bezier(0.22, 1, 0.36, 1),
			left 320ms cubic-bezier(0.22, 1, 0.36, 1),
			width 320ms cubic-bezier(0.22, 1, 0.36, 1),
			padding 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tab-text {
		display: block;
		transition:
			opacity 260ms ease,
			transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.tab-text-vertical {
		writing-mode: vertical-lr;
		text-orientation: mixed;
		opacity: 1;
		transform: translateX(0);
	}

	.tab-text-horizontal {
		opacity: 0;
		transform: translateY(-8px);
		position: absolute;
		left: 0;
		top: 0;
		white-space: nowrap;
	}

	.panel-card.is-active .edge-tab {
		top: 1rem;
		bottom: auto;
		left: var(--padding-main-block, 2rem);
		right: calc(var(--padding-main-block, 2rem) + 7rem);
		width: auto;
		max-width: none;
		padding: 0;
		display: flex;
		align-items: center;
	}

	.panel-card.is-active .tab-text-vertical {
		opacity: 0;
		transform: translateX(-10px);
		position: absolute;
	}

	.panel-card.is-active .tab-text-horizontal {
		opacity: 1;
		transform: translateY(0);
		position: static;
		white-space: normal;
	}

	.panel-card:not(.is-active) .panel-hit:hover + .edge-tab,
	.panel-card:not(.is-active) .panel-hit:focus-visible + .edge-tab {
		font-family: var(--font-primary-italic);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.panel-content {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		position: relative;
		z-index: 1;
		color: var(--panel-bg);
	}

	.panel-head {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 1rem var(--padding-main-block, 2rem);
		border-bottom: 2px solid var(--panel-bg);
	}

	.panel-body {
		overflow-y: auto;
		padding: var(--padding-main-block, 2rem);
	}

	.close {
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	@media (max-width: 900px) {
		.rail {
			--tab-peek: clamp(104px, 18vw, 140px);
			--stack-step: clamp(14px, 2.4vw, 24px);
			--hover-shift: clamp(18px, 4.2vw, 32px);
		}

		.edge-tab {
			font-size: 0.9rem;
		}
	}
</style>
