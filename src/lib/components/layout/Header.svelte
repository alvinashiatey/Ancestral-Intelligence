<script lang="ts">
	import { page } from '$app/state';
	import type { SEOData } from '$lib/types/seo';

	let {
		title = 'draught',
		description = 'draught is a journal that comes from a place of making. It is a journal on the in-progress and the provisional, on the idea, the practice, and the process of making work.',
		keywords = '',
		image = '',
		imageAlt = '',
		url = '',
		type = 'website',
		siteName = 'draught',
		locale = 'en_US',
		author = '',
		publishedTime = '',
		modifiedTime = '',
		section = '',
		tags = [],
		twitterCard = 'summary_large_image',
		twitterSite = '',
		twitterCreator = ''
	}: SEOData = $props();

	// Derive the current URL if not provided
	const currentUrl = $derived(url || page.url.href);

	// Create the full page title
	const pageTitle = $derived(title === 'draught' ? title : `${title} | draught`);

	// Ensure image has full URL if it's a relative path
	const fullImageUrl = $derived(
		image && !image.startsWith('http')
			? `${page.url.origin}${image.startsWith('/') ? image : '/' + image}`
			: image
	);

	// Generate structured data for rich snippets
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': type === 'article' ? 'Article' : 'WebPage',
		name: title,
		description: description,
		url: currentUrl,
		...(fullImageUrl && {
			image: {
				'@type': 'ImageObject',
				url: fullImageUrl,
				description: imageAlt
			}
		}),
		...(author && {
			author: {
				'@type': 'Person',
				name: author
			}
		}),
		...(publishedTime && {
			datePublished: publishedTime
		}),
		...(modifiedTime && {
			dateModified: modifiedTime
		})
	});
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	{#if author}
		<meta name="author" content={author} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={currentUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={locale} />

	{#if fullImageUrl}
		<meta property="og:image" content={fullImageUrl} />
		{#if imageAlt}
			<meta property="og:image:alt" content={imageAlt} />
		{/if}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}

	{#if type === 'article'}
		{#if author}
			<meta property="article:author" content={author} />
		{/if}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		{#each tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:url" content={currentUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	{#if fullImageUrl}
		<meta name="twitter:image" content={fullImageUrl} />
		{#if imageAlt}
			<meta name="twitter:image:alt" content={imageAlt} />
		{/if}
	{/if}

	{#if twitterSite}
		<meta name="twitter:site" content={twitterSite} />
	{/if}
	{#if twitterCreator}
		<meta name="twitter:creator" content={twitterCreator} />
	{/if}

	<!-- Additional SEO Meta Tags -->
	<meta name="robots" content="index, follow" />
	<meta
		name="googlebot"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta
		name="bingbot"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>
