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
	<g transform="matrix(1,0,0,1,21.666667,0)">
		<g transform="matrix(-1.277778,-0,0,-1.277778,567.777778,167.777778)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(-1.277778,-0,0,-1.277778,503.888889,244.444444)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(-1.277778,-0,0,-1.277778,440,321.111111)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(-1.277778,-0,0,-1.277778,695.555556,321.111111)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(-1.277778,-0,0,-1.277778,631.666667,244.444444)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(1.277778,0,-0,1.277778,-71.111111,372.222222)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(1.277778,0,-0,1.277778,-7.222222,295.555556)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(1.277778,0,-0,1.277778,56.666667,218.888889)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(1.277778,0,-0,1.277778,-198.888889,218.888889)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
		<g transform="matrix(1.277778,0,-0,1.277778,-135,295.555556)">
			<path d="M250,40L300,100L200,100L250,40Z" />
		</g>
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

	.pattern-svg.is-animated path {
		transform-box: fill-box;
		transform-origin: center;
		will-change: transform;
		animation: rotateFlip 5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
	}

	.pattern-svg.is-animated g:nth-of-type(2n) path {
		animation-delay: 120ms;
	}

	.pattern-svg.is-animated g:nth-of-type(3n) path {
		animation-delay: 260ms;
	}

	.pattern-svg.is-animated g:nth-of-type(4n) path {
		animation-delay: 480ms;
	}

	.pattern-svg.is-animated g:nth-of-type(5n) path {
		animation-delay: 700ms;
	}

	@keyframes rotateFlip {
		0%,
		15% {
			transform: rotate(0deg);
		}

		45%,
		65% {
			transform: rotate(180deg);
		}

		100% {
			transform: rotate(0deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pattern-svg.is-animated path {
			animation: none;
		}
	}
</style>
