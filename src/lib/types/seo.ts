export interface SEOData {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	imageAlt?: string;
	url?: string;
	type?: 'website' | 'article' | 'product' | 'profile';
	siteName?: string;
	locale?: string;
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	tags?: string[];
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	twitterSite?: string;
	twitterCreator?: string;
}
