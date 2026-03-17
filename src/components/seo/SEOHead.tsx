import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  robots?: string;
  jsonLd?: object | object[];
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = 'https://jfk.meme/image.png',
  ogType = 'website',
  robots,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    function setMeta(name: string, content: string, property = false) {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    function setLink(rel: string, href: string) {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    setMeta('description', description);
    setLink('canonical', canonical);

    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonical, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    if (robots) {
      setMeta('robots', robots);
    }

    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach(s => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo-jsonld]');
      scripts.forEach(s => s.remove());
    };
  }, [title, description, canonical, ogImage, ogType, robots, jsonLd]);

  return null;
}
