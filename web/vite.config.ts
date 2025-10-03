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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxResolver: any = {
  enforce: 'pre',
  ...mdx({
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
    rehypePlugins: [rehypeHighlight],
    providerImportSource: '@mdx-js/react',
  }),
}

export default defineConfig({
  root: path.resolve(__dirname, './'),
  plugins: [
    searchIndexPlugin(),
    mdxResolver,
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime'),
      'react': path.resolve(__dirname, './node_modules/react'),
    },
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
});
