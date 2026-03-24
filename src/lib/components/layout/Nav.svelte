<script lang="ts">
	import Pattern03 from '$lib/components/patterns/Pattern03.svelte';

	type NavSection = 'collaborators' | 'sessions' | 'library' | 'class' | 'archive';

	const { onSelectSection, onHome } = $props<{
		onSelectSection?: (section: NavSection) => void;
		onHome?: () => void;
	}>();

	function onHomeClick(event: MouseEvent) {
		event.preventDefault();
		onHome?.();
	}
</script>

<nav>
	<!-- <div class="nav-pattern" aria-hidden="true"> -->
	<!-- 	<Pattern03 color="#ffffff" fit="slice" /> -->
	<!-- </div> -->
	<ol>
		<li class="title">
			<a href="/" onclick={onHomeClick}>
				<h1>Ancestral Intelligence <br /> and Material Knowledge</h1>
			</a>
		</li>
		<li class="collaborators">
			<button type="button" onclick={() => onSelectSection?.('collaborators')}>
				<h2>Collaborators</h2>
			</button>
		</li>
		<li class="sessions">
			<button type="button" onclick={() => onSelectSection?.('sessions')}>
				<h2>Sessions</h2>
			</button>
		</li>
		<li class="library">
			<button type="button" onclick={() => onSelectSection?.('library')}>
				<h2>Library</h2>
			</button>
		</li>
		<li class="class">
			<button type="button" onclick={() => onSelectSection?.('class')}>
				<h2>Class</h2>
			</button>
		</li>
		<li class="archive">
			<button type="button" onclick={() => onSelectSection?.('archive')}>
				<h2>Archive</h2>
			</button>
		</li>
	</ol>
</nav>

<style>
	nav {
		width: 20vw;
		padding-block: var(--padding-main-block, 2rem);
		padding-inline-end: var(--padding-main-block, 2rem);
		padding-inline-start: var(--padding-main-block, 2rem);
		/* border-right: 1px solid #eee; */
		/* background-color: #eee; */
		position: relative;
		overflow: hidden;
	}

	.nav-pattern {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.25;
	}

	nav ol {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		position: relative;
		z-index: 1;
	}
	nav ol li a h1:hover,
	nav ol li button h2:hover {
		font-family: var(--font-primary-italic);
		cursor: pointer;
	}

	nav ol li button {
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
	}
	.title {
		position: sticky;
		width: max-content;
	}
</style>
