import type { SEOData } from './types/seo';

/**
 * Default SEO configuration for the GICA website
 */
export const defaultSEO: SEOData = {
	title: 'Indigenous Knowledge',
	description: 'Description',
	siteName: 'Indigenous Knowledge',
	type: 'website',
	locale: 'en_US',
	twitterCard: 'summary_large_image',
	keywords: 'Indigenous Knowledge',
	// image: '/images/og-default.jpg',
	imageAlt: 'Indigenous Knowledge'
};

/**
 * Merges provided SEO data with defaults
 */
export function createSEOData(seoData: Partial<SEOData> = {}): SEOData {
	return {
		...defaultSEO,
		...seoData
	};
}

/**
 * Creates article-specific SEO data
 */
export function createArticleSEO(
	title: string,
	description: string,
	options: Partial<SEOData> = {}
): SEOData {
	return createSEOData({
		title,
		description,
		type: 'article',
		publishedTime: new Date().toISOString(),
		...options
	});
}

/**
 * Generates SEO-friendly URL slug from title
 */
export function createSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single
		.trim()
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Formats date for Open Graph and Twitter meta tags
 */
export function formatSEODate(date: Date): string {
	return date.toISOString();
}

/**
 * Truncates description to optimal length for social media
 */
export function truncateDescription(description: string, maxLength: number = 160): string {
	if (description.length <= maxLength) return description;

	return description.substring(0, maxLength - 3).trim() + '...';
}
