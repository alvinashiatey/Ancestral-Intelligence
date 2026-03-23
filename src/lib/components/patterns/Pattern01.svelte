<script lang="ts">
	type PatternFit = 'slice' | 'meet' | 'none';

	const {
		color = 'var(--pattern-color, #6f5453)',
		fit = 'slice',
		animated = false,
		className = ''
	} = $props<{
		color?: string;
		fit?: PatternFit;
		animated?: boolean;
		className?: string;
	}>();

	function preserveAspectRatioFor(value: PatternFit) {
		if (value === 'none') return 'none';
		if (value === 'meet') return 'xMidYMid meet';
		return 'xMidYMid slice';
	}
</script>

<svg
	class={`pattern-svg ${animated ? 'is-animated' : ''} ${className}`.trim()}
	viewBox="0 0 540 540"
	preserveAspectRatio={preserveAspectRatioFor(fit)}
	style={`color: ${color};`}
	aria-hidden="true"
>
	<g transform="matrix(1,0,0,1,0,-10)">
		<g transform="matrix(0.6,0,0,1,0,20)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.6,0,0,1,0,100)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.6,0,0,1,0,180)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.6,0,0,1,0,260)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.6,0,0,1,0,340)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,140,20)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,140,100)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,140,180)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,140,260)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,140,340)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,60,60)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,60,140)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,60,220)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,60,300)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,60,380)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,220,60)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,220,140)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,220,220)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,220,300)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,220,380)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,380,60)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,380,140)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,380,220)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,380,300)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,380,380)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,300,20)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,300,100)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,300,180)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,300,260)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,300,340)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,460,20)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,460,100)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,460,180)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,460,260)"><rect x="0" y="60" width="100" height="40" /></g>
		<g transform="matrix(0.8,0,0,1,460,340)"><rect x="0" y="60" width="100" height="40" /></g>
	</g>
	<g transform="matrix(4.2,0,0,1,60,-50)"><rect x="0" y="60" width="100" height="40" /></g>
	<g transform="matrix(4.2,0,0,1,60,430)"><rect x="0" y="60" width="100" height="40" /></g>
</svg>

<style>
	.pattern-svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.pattern-svg rect {
		fill: currentColor;
		stroke: none;
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
	}

	/* translate-X animation */
	.pattern-svg.is-animated g {
		will-change: translate;
		animation: shiftX 5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
	}

	.pattern-svg.is-animated g:nth-of-type(2n) {
		animation-delay: 120ms;
	}

	.pattern-svg.is-animated g:nth-of-type(3n) {
		animation-delay: 260ms;
	}

	.pattern-svg.is-animated g:nth-of-type(4n) {
		animation-delay: 480ms;
	}

	.pattern-svg.is-animated g:nth-of-type(5n) {
		animation-delay: 700ms;
	}

	@keyframes shiftX {
		0%,
		15% {
			translate: 0 0;
		}

		45%,
		65% {
			translate: 22px 0;
		}

		100% {
			translate: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pattern-svg.is-animated g {
			animation: none;
		}
	}
</style>
