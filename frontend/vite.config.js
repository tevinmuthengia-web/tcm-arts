import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seoFiles from 'vite-plugin-seo-files';

export default defineConfig({
  plugins: [
    react(),
    seoFiles({
      siteUrl: 'https://tcm-arts.onrender.com',
      generateSitemap: true,
      generateRobots: true,
      exclude: ['admin/**', 'dashboard/**', 'reset-password', 'forgot-password'],
      additionalUrls: [
        '/',
        '/fine-arts',
        '/skating',
        '/chess',
        '/bookings'
      ],
      disallow: [
        '/admin/*',
        '/dashboard/*',
        '/api/*',
        '/reset-password',
        '/forgot-password'
      ],
      changefreq: 'weekly',
      priority: {
        '/': 1.0,
        '/fine-arts': 0.9,
        '/skating': 0.9,
        '/chess': 0.9,
        '/bookings': 0.8
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
