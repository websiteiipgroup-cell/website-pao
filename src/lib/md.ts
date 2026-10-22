import { marked } from 'marked';
export const md = (s?: string) => (s ? (marked.parse(s, { async: false }) as string) : '');

/** Digits-only phone for tel: links. */
export const tel = (s: string) => 'tel:' + s.replace(/[^0-9+]/g, '');

/** Resolve "whatsapp" shortcut used in CMS link fields. */
export const link = (href: string | undefined, wa?: string) =>
  href === 'whatsapp' ? (wa ? `https://wa.me/${wa}` : '/contact/') : (href || '#');
