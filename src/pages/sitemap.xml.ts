import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const RESERVED = ['home', 'products', 'news', 'admin', '404'];

export const GET: APIRoute = async ({ site }) => {
  const pages = (await getCollection('halaman')).filter((p) => !RESERVED.includes(p.id));
  const oils = await getCollection('produk');
  const news = await getCollection('berita', (p) => !p.data.draft);
  const paths = ['/', ...pages.map((p) => `/${p.id}/`), '/products/', ...oils.map((p) => `/products/${p.id}/`),
    ...(news.length ? ['/news/', ...news.map((p) => `/news/${p.id}/`)] : [])];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    paths.map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
