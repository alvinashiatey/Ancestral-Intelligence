<script lang="ts">
	const {
		imageSrc,
		imageAlt = 'Collaborator portrait',
		bio
	} = $props<{
		imageSrc: string;
		imageAlt?: string;
		bio: string;
	}>();
</script>

<article class="collaborator-card">
	<img class="portrait" src={imageSrc} alt={imageAlt} loading="lazy" />
	<p class="bio">{bio}</p>
</article>

<style>
	.collaborator-card {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.portrait {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	.bio {
		margin: 0;
		padding-block: var(--space-2);
		font-size: var(--font-size-sm);
	}
</style>
