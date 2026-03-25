<script lang="ts">
	import FilteredImage from '$lib/components/FilteredImage.svelte';

	const placeholders = Array.from({ length: 9 }, (_, index) => index + 1);
</script>

<section class="panel-content">
	<div class="collaborators-grid">
		{#each placeholders as id}
			<div class="collaborator-card">
				<FilteredImage src="/images/banor.jpg" alt={`Collaborator placeholder ${id}`} width="100%" />
			</div>
		{/each}
	</div>
</section>

<style>
	.collaborators-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.collaborator-card {
		min-width: 0;
		border: 1px solid color-mix(in oklab, currentColor 25%, transparent);
	}

	.collaborator-card :global(.photo-wrap) {
		display: block;
		width: 100%;
	}

	.collaborator-card :global(.photo) {
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	.collaborator-card :global(.caption) {
		display: none;
	}

	@media (max-width: 900px) {
		.collaborators-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.collaborators-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
