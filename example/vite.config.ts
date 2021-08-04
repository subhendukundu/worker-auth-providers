import path from 'path'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'
import vitedge from 'vitedge/plugin.js'
import mdx from 'vite-plugin-mdx'
// @ts-ignore
import remarkPrism from 'remark-prism'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    reactRefresh(),
    vitedge(),
    // @ts-ignore
    mdx.default({
      remarkPlugins: [remarkPrism],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    // @ts-ignore
    Pages.default({
      react: true,
      extensions: ['jsx', 'tsx', 'mdx'],
    }),

    // https://github.com/antfu/vite-plugin-windicss
    // @ts-ignore
    WindiCSS.default({
      safelist: 'prose prose-sm m-auto',
    }),
  ],

  optimizeDeps: {
    include: ['@mdx-js/react', '@react-icons/all-files'],
    exclude: [],
  },
})
