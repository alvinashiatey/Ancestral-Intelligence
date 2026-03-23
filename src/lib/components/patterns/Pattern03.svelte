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
	<g transform="matrix(1.285714,0,-0,1.285714,-51.428571,-50.590062)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-115.714286,26.552795)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,12.857143,26.552795)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,77.142857,-51.428571)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,77.142857,103.695652)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,77.142857,257.981366)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,77.142857,411.428571)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(-1.285714,0,0,1.285714,462.857143,-51.428571)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(-1.285714,0,0,1.285714,462.857143,103.695652)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(-1.285714,0,0,1.285714,462.857143,257.981366)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(-1.285714,0,0,1.285714,462.857143,411.428571)">
		<path d="M360,100L200,100L250,40L360,40L360,100Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-51.428571,103.695652)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-115.714286,180.838509)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,12.857143,180.838509)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-51.428571,257.981366)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-51.428571,410.590062)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,-115.714286,335.124224)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
	<g transform="matrix(1.285714,0,-0,1.285714,12.857143,335.124224)">
		<path d="M250,40L300,100L200,100L250,40Z" />
	</g>
</svg>

<style>
	.pattern-svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.pattern-svg path {
		fill: currentColor;
		stroke: none;
	}

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
