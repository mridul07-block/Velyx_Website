import { Helmet } from "react-helmet-async";
import { SITE } from "./seoConfig";

/* ------------------------------------------------------------------
   SEO — per-route <head> tags (title, description, canonical,
   Open Graph, Twitter) plus optional JSON-LD structured data.
   Drop <Seo .../> at the top of every page.
------------------------------------------------------------------ */

export default function Seo({
  title,
  description = SITE.defaultDescription,
  path = "/",
  image = SITE.ogImage,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} · ${SITE.name}` : SITE.defaultTitle;
  const canonical = `${SITE.url}${path === "/" ? "" : path}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
