<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Nav from '$lib/components/layout/Nav.svelte';
	import BackgroundCanvas from '$lib/components/BackgroundCanvas.svelte';
	import ArchivePanel from '$lib/components/panels/ArchivePanel.svelte';
	import ClassPanel from '$lib/components/panels/ClassPanel.svelte';
	import CollaboratorsPanel from '$lib/components/panels/CollaboratorsPanel.svelte';
	import LibraryPanel from '$lib/components/panels/LibraryPanel.svelte';
	import PanelStackRail from '$lib/components/panels/PanelStackRail.svelte';
	import Pattern01 from '$lib/components/patterns/Pattern01.svelte';
	import Pattern02 from '$lib/components/patterns/Pattern02.svelte';
	import Pattern03 from '$lib/components/patterns/Pattern03.svelte';
	import SessionsPanel from '$lib/components/panels/SessionsPanel.svelte';
	import { createSEOData } from '$lib/seo';

	type PanelKey = 'collaborators' | 'sessions' | 'library' | 'class' | 'archive';

	const patternComponents = [Pattern01, Pattern02, Pattern03] as const;
	const panelRegistry = {
		collaborators: {
			title: 'Collaborators',
			backgroundColor: '#506850',
			component: CollaboratorsPanel
		},
		sessions: {
			title: 'Sessions',
			backgroundColor: '#af8d58',
			component: SessionsPanel
		},
		library: {
			title: 'Library',
			backgroundColor: '#b9afa3',
			component: LibraryPanel
		},
		class: {
			title: 'Class',
			backgroundColor: '#3a6a82',
			component: ClassPanel
		},
		archive: {
			title: 'Archive',
			backgroundColor: '#9c5a6a',
			component: ArchivePanel
		}
	} as const;

	let activePatternIndex = $state(0);
	let activePanel = $state<PanelKey | null>(null);
	let isTitleHovered = $state(false);
	const ActivePattern = $derived(patternComponents[activePatternIndex]);
	const panelItems = [
		{ key: 'collaborators', ...panelRegistry.collaborators },
		{ key: 'sessions', ...panelRegistry.sessions },
		{ key: 'library', ...panelRegistry.library },
		{ key: 'class', ...panelRegistry.class },
		{ key: 'archive', ...panelRegistry.archive }
	] as const;

	function openPanel(section: PanelKey) {
		activePanel = section;
	}

	function closePanel() {
		activePanel = null;
	}

	function onHomeSelected() {
		closePanel();
	}

	function onTitleEnter() {
		isTitleHovered = true;
	}

	function onTitleLeave() {
		isTitleHovered = false;
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && activePanel) {
			closePanel();
		}
	}

	onMount(() => {
		activePatternIndex = Math.floor(Math.random() * patternComponents.length);
	});

	const seoData = createSEOData({
		image: '',
		title: 'Indigenous Knowledge',
		url: 'https://aiia.yaleschoolofart.org'
	});
</script>

<Header {...seoData} />
<svelte:window onkeydown={onWindowKeydown} />
<BackgroundCanvas {isTitleHovered} tintVariable="--bg-tint" tintFallback="#673399" />
<div class="container">
	<div class="nav-layer">
		<Nav onHome={onHomeSelected} {onTitleEnter} {onTitleLeave} />
	</div>
	<section class="details">
		<section class="center">
			<article class="about-body">
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
			</article>
			<!-- <div class="pattern"> -->
			<!-- 	<ActivePattern animated fit="slice" /> -->
			<!-- </div> -->
		</section>
		<PanelStackRail
			items={panelItems}
			activeKey={activePanel}
			onSelect={(key) => openPanel(key as PanelKey)}
			onClose={closePanel}
		/>
	</section>
</div>

<style>
	.container {
		display: flex;
		/* gap: 2.5rem; */
		height: 100dvh;
		overflow: hidden;
		position: relative;
		z-index: 1;
	}

	.nav-layer {
		position: relative;
		z-index: 6;
	}

	section.details {
		width: 80vw;
		height: 100dvh;
		overflow: hidden;
		position: relative;
		display: block;
		--panel-stack-reserve: clamp(220px, 24vw, 360px);
		/* padding-inline-start: var(--padding-main-block, 2rem); */
		/* background-color: tomato; */
		/* gap: 2.5rem; */
	}

	section.center {
		overflow-y: auto;
		padding-inline-start: var(--padding-main-block, 2rem);
		padding-inline-end: calc(var(--panel-stack-reserve) + var(--padding-main-block, 2rem));
		position: relative;
	}

	.about-body {
		padding-block: var(--padding-main-block, 2rem);
	}

	/* p:not(:last-child) { */
	/* 	margin-block-end: 1rem; */
	/* } */

	@media (max-width: 900px) {
		section.details {
			--panel-stack-reserve: clamp(140px, 22vw, 220px);
		}
	}
</style>
