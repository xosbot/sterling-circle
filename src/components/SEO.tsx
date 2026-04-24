import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

const SITE = "Noir/Vault";
const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

const SEO = ({ title, description, image = "/og-image.jpg", type = "website" }: SEOProps) => {
  const { pathname } = useLocation();
  const url = `${ORIGIN}${pathname}`;
  const fullTitle = `${title} — ${SITE}`;
  const ogImage = image.startsWith("http") ? image : `${ORIGIN}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
