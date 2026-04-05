import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  keywords?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title = 'Quantplex.AI',
  description = 'We work with you to build internal LLMs for your business needs. Boost productivity and unlock new capabilities with AI.',
  canonical,
  ogImage = '/quantplex-logo.svg',
  ogType = 'website',
  twitterCardType = 'summary_large_image',
  keywords = 'LLM, AI, business, internal AI, artificial intelligence, machine learning, custom AI models, enterprise AI',
  noIndex = false,
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantplex.ai';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Quantplex.AI" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Head>
  );
}