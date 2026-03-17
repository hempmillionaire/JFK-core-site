export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  jsonLd?: object | object[];
}

export function buildTitle(page: string): string {
  return page;
}

export function buildDescription(desc: string): string {
  return desc.length > 160 ? desc.slice(0, 157) + '...' : desc;
}

export function buildCanonical(path: string): string {
  return `https://jfk.meme${path}`;
}

export function buildJsonLd(type: string, data: Record<string, unknown>): object {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  return { ...base, ...data };
}

export function buildWebPageSchema(title: string, description: string, url: string): object {
  return buildJsonLd('WebPage', {
    name: title,
    description,
    url,
  });
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return buildJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return buildJsonLd('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

export function buildHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string }>
): object {
  return buildJsonLd('HowTo', {
    name: title,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  });
}

export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatPrice(value: number): string {
  if (value >= 1) return `$${value.toFixed(4)}`;
  if (value >= 0.01) return `$${value.toFixed(6)}`;
  return `$${value.toFixed(9)}`;
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
