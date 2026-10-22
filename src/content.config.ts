import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const halaman = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/halaman' }),
  schema: z.object({
    judul: z.string(),
    deskripsi: z.string().optional().default(''),
    // Pages with a step number form the "From deposit to your refinery" chain
    // and get previous/next links between them.
    langkah: z.number().int().optional(),
    ringkasan: z.string().optional().default(''),
    gambar: z.string().optional().default(''),
    blocks: z.array(z.object({ type: z.string() }).passthrough()).optional().default([]),
  }),
});

const produk = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produk' }),
  schema: z.object({
    nama: z.string(),
    urutan: z.number().optional().default(99),
    ringkasan: z.string().optional().default(''),
    varian: z.array(z.string()).optional().default([]),
    grade: z.array(z.string()).optional().default([]),
    warna_crude: z.string().optional().default('#8a2f0c'),
    warna_bleached: z.string().optional().default('#e8b52c'),
    gambar: z.string().optional().default(''),
  }),
});

const berita = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
  schema: z.object({
    judul: z.string(),
    tanggal: z.coerce.date(),
    cover: z.string().optional().default(''),
    ringkasan: z.string().optional().default(''),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { halaman, produk, berita };
