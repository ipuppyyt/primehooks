import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeHighlight from 'rehype-highlight'
import { searchIndexPlugin } from './plugins'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import path from "path"


export default defineConfig(({ mode }) => {
  return {
    root: path.resolve(__dirname, './'),
    plugins: [
      searchIndexPlugin(),
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            remarkMdxFrontmatter,
          ],
          rehypePlugins: [rehypeHighlight],
          providerImportSource: '@mdx-js/react',
          development: mode === 'development',
        }),
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        '@mdx-js/react': path.resolve(__dirname, './node_modules/@mdx-js/react'),
      },
    },
    optimizeDeps: {
      include: ['react/jsx-runtime', '@mdx-js/react', 'react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@mdx-js/react'],
    },
    server: {
      fs: {
        allow: [
          path.resolve(__dirname, '..'),
        ],
        strict: false,
      },
      watch: {
        ignored: ['!**/content/**'],
      },
    },
  }
});