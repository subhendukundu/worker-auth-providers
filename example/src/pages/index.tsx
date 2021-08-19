import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect } from "react-router-dom";
import { FaSpotify } from '@react-icons/all-files/fa/FaSpotify'
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord'
import { AiFillGithub } from '@react-icons/all-files/ai/AiFillGithub'
import { AiOutlineGoogle } from '@react-icons/all-files/ai/AiOutlineGoogle'
import { useAuth } from '../providers/AuthProvider'

export default function Home({ message }: any) {
  const { token } = useAuth();
  const { t } = useTranslation();

  if (token === null) {
    return <div>loading...</div>;
  }

  if (token) {
    return <Redirect to="/me" />;
  }

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
          href="/api/v1/auth/google/redirect"
          title="Template"
        >
          <AiOutlineGoogle />
        </a>
        <a
          className="icon-btn"
          rel="noreferrer"
          href="/api/v1/auth/spotify/redirect"
          title="Template"
        >
          <FaSpotify />
        </a>
        <a
          className="icon-btn"
          rel="noreferrer"
          href="/api/v1/auth/discord/redirect"
          title="Template"
        >
          <FaDiscord />
        </a>
      </nav>
    </div>
  )
}
