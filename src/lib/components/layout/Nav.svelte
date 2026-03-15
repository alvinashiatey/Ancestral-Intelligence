<script lang="ts"></script>

<nav>
	<ol>
		<li class="title">
			<a href="/">
				<h1>Indigenous Knowledge</h1>
			</a>
		</li>
		<li class="collaborators">
			<a href="/collaborators">
				<h2>Collaborators</h2>
			</a>
		</li>
		<li class="sessions">
			<a href="/sessions">
				<h2>Sessions</h2>
			</a>
		</li>
		<li class="library">
			<a href="/library">
				<h2>Library</h2>
			</a>
		</li>
		<li class="class">
			<a href="/class">
				<h2>Class</h2>
			</a>
		</li>
		<li class="archive">
			<a href="/archive">
				<h2>Archive</h2>
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
		border-right: 1px solid #eee;
		/* background-color: #bebebe; */
	}
	nav ol {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	nav ol li a h2:hover,
	nav ol li a h1:hover {
		font-family: var(--font-primary-italic);
		cursor: pointer;
	}
	.title {
		position: sticky;
		width: max-content;
	}
</style>
