import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCampground } from '@react-icons/all-files/fa/FaCampground'
import { FiStar } from '@react-icons/all-files/fi/FiStar'
import { FiMoon } from '@react-icons/all-files/fi/FiMoon'
import { FiSun } from '@react-icons/all-files/fi/FiSun'
import { IoLanguage } from '@react-icons/all-files/io5/IoLanguage'
import { AiOutlineFileText } from '@react-icons/all-files/ai/AiOutlineFileText'
import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub'
import { useDarkTheme } from '~/utils/dark-theme'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES as locales } from '~/i18n'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const [isDark, toggleDark] = useDarkTheme()

  const { t, i18n } = useTranslation()
  const route = useLocation()

  const toggleLocales = () => {
    const nextLocale =
      locales[(locales.indexOf(i18n.language) + 1) % locales.length]
    const base = nextLocale === DEFAULT_LOCALE ? '' : `/${nextLocale}`
    window.location.pathname = base + route.pathname
  }

  return (
    <nav className="text-xl mt-6 space-x-2">
      <Link className="icon-btn" to="/" title={t('button.home')}>
        <FaCampground />
      </Link>

      <a
        className="icon-btn"
        rel="noreferrer"
        href="https://github.com/frandiox/vite-ssr"
        target="_blank"
        title="Library"
      >
        <FiStar />
      </a>

      <a
        className="icon-btn"
        title={t('button.toggle_dark')}
        onClick={toggleDark}
      >
        {isDark ? <FiMoon /> : <FiSun />}
      </a>
      <a
        className="icon-btn"
        title={t('button.toggle_langs')}
        onClick={toggleLocales}
      >
        <IoLanguage />
      </a>

      <Link className="icon-btn" title={t('button.about')} to="/about">
        <AiOutlineFileText />
      </Link>

      <a
        className="icon-btn"
        rel="noreferrer"
        href="https://github.com/frandiox/reactesse-edge-template"
        target="_blank"
        title="Template"
      >
        <AiFillGithub />
      </a>
    </nav>
  )
}
