import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://brightsmiledental.co.uk";

/**
 * Updates all SEO meta tags dynamically for each page.
 * Updates: title, description, keywords, canonical, og:*, twitter:*
 */
export default function useSEO({ title, description, keywords }) {
  const { pathname } = useLocation();
  const canonical = `${BASE_URL}${pathname}`;

  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/update a meta tag
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(attrName, attrValue.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Helper to set/update a link tag
    const setLink = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Standard meta
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="keywords"]', "content", keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:image"]', "content", `${BASE_URL}/og-image.jpg`);
    setMeta('meta[property="og:site_name"]', "content", "Bright Smile Dental Care");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", `${BASE_URL}/og-image.jpg`);

    // Canonical URL
    setLink('link[rel="canonical"]', "href", canonical);
  }, [title, description, keywords, canonical]);
}
