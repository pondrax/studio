// import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['localhost', 'dev.dra.my.id', 'preview.dra.my.id']
  },
  plugins: [
    sveltekit(),
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'cookie', 'baseLocale']
    })
  ]
});
