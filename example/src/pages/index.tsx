import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSpotify } from '@react-icons/all-files/fa/FaSpotify'
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord'
import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub'
import { AiOutlineGoogle } from '@react-icons/all-files/ai/AiOutlineGoogle'

export default function Home({ message }: any) {
  const [name = '', setName] = useState<string>()

  const history = useHistory()
  const go = () => {
    history.push(`/hi/${encodeURIComponent(name)}`)
  }

  const { t } = useTranslation()

  return (
    <div>
      <p className="text-4xl flex justify-center">
        <img src="/logo.png" alt="worker-auth-providers" style={{ width: '120px' }} />
      </p>
      <p className="py-4">
        <a
          rel="noreferrer"
          href="https://github.com/frandiox/reactesse-edge-template"
          target="_blank"
        >
          worker-auth-providers
        </a>
      </p>
      <p>
        <em className="text-sm opacity-75">{t('intro.desc')}</em>
      </p>
      <div className="py-4" />
      <nav className="text-4xl mt-6 space-x-2">
        <a
          className="icon-btn"
          rel="noreferrer"
          href="/api/v1/auth/github/redirect"
          title="Github Login"
        >
          <AiFillGithub />
        </a>
        <a
          className="icon-btn"
          rel="noreferrer"
          href="https://github.com/frandiox/reactesse-edge-template"
          title="Template"
        >
          <AiOutlineGoogle />
        </a>
        <a
          className="icon-btn"
          rel="noreferrer"
          href="https://github.com/frandiox/reactesse-edge-template"
          title="Template"
        >
          <FaSpotify />
        </a>
        <a
          className="icon-btn"
          rel="noreferrer"
          href="https://github.com/frandiox/reactesse-edge-template"
          title="Template"
        >
          <FaDiscord />
        </a>
      </nav>
      <p className="py-4 text-sm">OR</p>
      <input
        id="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('intro.whats-your-name')}
        aria-label={t('intro.whats-your-name')}
        type="text"
        autoComplete="false"
        className="px-4 py-2 text-sm text-center bg-transparent border border-gray-200 rounded outline-none active:outline-none dark:border-gray-700"
        style={{ width: '250px' }}
      />
      <label className="hidden" htmlFor="input">
        {t('intro.whats-your-name')}
      </label>
      <div>
        <button className="m-3 text-sm btn" disabled={!name} onClick={go}>
          {t('button.aws_otp')}
        </button>
      </div>
      <p className="py-4 text-sm">OR</p>
      <input
        id="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('intro.whats-your-name')}
        aria-label={t('intro.whats-your-name')}
        type="text"
        autoComplete="false"
        className="px-4 py-2 text-sm text-center bg-transparent border border-gray-200 rounded outline-none active:outline-none dark:border-gray-700"
        style={{ width: '250px' }}
      />
      <label className="hidden" htmlFor="input">
        {t('intro.whats-your-name')}
      </label>
      <div>
        <button className="m-3 text-sm btn" disabled={!name} onClick={go}>
          {t('button.twillio_otp')}
        </button>
      </div>
    </div>
  )
}
