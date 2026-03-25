<script lang="ts">
	import Collaborator from '$lib/components/panels/Collaborator.svelte';

	const placeholderBio =
		'Banor is a visual collaborator exploring archives, performance fragments, and memory studies through image-based storytelling.';

	const collaborators = Array.from({ length: 9 }, (_, index) => ({
		id: index + 1,
		imageSrc: '/images/banor.jpg',
		imageAlt: `Banor collaborator placeholder ${index + 1}`,
		bio: placeholderBio
	}));
</script>

<section class="panel-content">
	<div class="collaborators-grid">
		{#each collaborators as collaborator (collaborator.id)}
			<Collaborator
				imageSrc={collaborator.imageSrc}
				imageAlt={collaborator.imageAlt}
				bio={collaborator.bio}
			/>
		{/each}
	</div>
</section>

<style>
	.collaborators-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-4);
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
