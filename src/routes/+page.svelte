<script lang="ts">
	import FilteredImage from '$lib/components/FilteredImage.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Nav from '$lib/components/layout/Nav.svelte';
	import { createSEOData } from '$lib/seo';
	const seoData = createSEOData({
		image: '',
		title: 'Indigenous Knowledge',
		url: 'https://aiia.yaleschoolofart.org'
	});
</script>

<Header {...seoData} />
<div class="container">
	<Nav />
	<section class="details">
		<section class="center">
			<div class="about">
				<p>
					Honoring and Incorporating Indigenous Technologies is a cross-cultural, cross-continental
					initiative exploring how traditional African craft techniques — beadwork, weaving, and
					natural dyeing among them — can enrich arts and humanities education while driving
					innovation in contemporary design. Led by Nontsikelelo Mutiti, Assistant Professor and
					Director of Graduate Studies for Graphic Design at the Yale School of Art, the project
					unites artists, scholars, and cultural practitioners from Africa and the diaspora to
					cultivate meaningful exchange between Indigenous knowledge systems and contemporary
					creative practice.
				</p>
				<p>
					The initiative takes shape through hands-on workshops, academic talks, study abroad
					programs, and a culminating exhibition, each designed to give traditional craft traditions
					room to thrive and evolve within academic and artistic contexts. Collaborating
					practitioners include Mbali Mtethwa, Laduma Ngxokolo, Busayo Olupona, and Hlengiwe Dube,
					working alongside Yale partners such as the School of Art's Fabric Lab, the Institute of
					Cultural Heritage Preservation, and the Yale University Art Gallery. Together, they
					approach craft as a living cultural archive: one that encodes history, identity, and
					community bonds across generations.
				</p>
				<p>
					By positioning Indigenous technologies as genuine sites of innovation and knowledge
					production, the initiative seeks to reshape arts pedagogy and establish a replicable model
					for cross-cultural academic collaboration worldwide.
				</p>
			</div>
		</section>
		<section class="right">
			<div class="images">
				<FilteredImage src="/images/banor.jpg" alt="Svelte logo" width={300} caption="Banor" />
				<FilteredImage
					src="/images/csfahftb.jpg"
					alt="Svelte logo"
					width={300}
					moveStrength={0.25}
					caption="Cultural Significance of Fabric and Textile in African History"
				/>
			</div>
		</section>
	</section>
</div>

<style>
	.container {
		display: flex;
		/* gap: 2.5rem; */
		height: 100dvh;
		overflow: hidden;
	}

	.about,
	.images {
		padding-block: var(--padding-main-block, 2rem);
	}

	section.details {
		width: 80vw;
		height: 100dvh;
		overflow-y: hidden;
		display: grid;
		grid-template-columns: 2fr calc(300px + var(--padding-main-block, 2rem) * 2);
		/* padding-inline-start: var(--padding-main-block, 2rem); */
		/* background-color: tomato; */
		/* gap: 2.5rem; */
	}

	section.center {
		overflow-y: auto;
		padding-inline: var(--padding-main-block, 2rem);
	}

	section.right {
		overflow-y: auto;
		padding-inline: var(--padding-main-block, 2rem);
		background-color: black;
	}

	p:not(:last-child) {
		margin-block-end: 1rem;
	}
</style>
