import React from 'react'
import { Redirect, useHistory } from "react-router-dom";
import { FaRegHandSpock } from '@react-icons/all-files/fa/FaRegHandSpock'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../providers/AuthProvider'

export default function Me() {
  const history = useHistory()
  const { token, logout } = useAuth();

  const { t } = useTranslation();

  function onLogout(){
    logout();
    history.push("/");
  }

  if (token === null) {
    return <div>loading...</div>;
  }

  if (!token) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <p className="text-4xl">
        <FaRegHandSpock className="inline-block" />
      </p>
      <p>{t('intro.hi', { name })}</p>
      <p className="text-sm opacity-50">
        <em>{t('intro.dynamic-route')}</em>
      </p>
      <div>
        <button
          className="btn m-3 text-sm mt-8"
          onClick={onLogout}
        >
          {t('button.logout')}
        </button>
      </div>
    </div>
  )
}
