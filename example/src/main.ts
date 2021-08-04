import 'windi.css'
import './styles/main.css'
import vitedge from 'vitedge'
import routes from 'virtual:generated-pages'
import App from './App'

import { installI18n, extractLocaleFromPath, DEFAULT_LOCALE } from './i18n'

routes.forEach((route) => {
  const { path } = route
  route.name =
    path
      .replace(/^\//, '')
      .replace(/:/, '')
      .replace(/\//, '-')
      .replace('all(.*)', 'not-found') || 'home'

  route.path = route.path.includes('*') ? '*' : route.path
})

// https://github.com/frandiox/vite-ssr
export default vitedge(
  App,
  {
    routes,
    // Use Router's base for i18n routes
    base: ({ url }) => {
      const locale = extractLocaleFromPath(url.pathname)
      return locale === DEFAULT_LOCALE ? '/' : `/${locale}/`
    },
  },
  // @ts-ignore
  async ({ url }) => {
    // Load language asyncrhonously to avoid bundling all languages
    await installI18n(extractLocaleFromPath(url.pathname))
  }
)
