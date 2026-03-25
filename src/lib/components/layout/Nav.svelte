<script lang="ts">
	const { onHome } = $props<{
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

	nav ol {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		position: relative;
		z-index: 1;
	}
	nav ol li a h1:hover {
		font-family: var(--font-primary-italic);
		cursor: pointer;
	}
	.title {
		position: sticky;
		width: max-content;
	}
</style>
