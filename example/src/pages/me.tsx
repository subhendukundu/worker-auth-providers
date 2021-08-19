import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { useAuth } from '../providers/AuthProvider'

export default function Me() {
  const history = useHistory()
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>({});
  const { name, image } = user;
  const { t } = useTranslation();

  function onLogout(){
    logout();
    history.push("/");
  }

  useEffect(() => {
    async function getUser() {
        const res = await fetch('/api/v1/user/me', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
    }
    if(token) {
        getUser();
    }
  }, [token]);

  if (token === null) {
    return <div>loading...</div>;
  }

  if (!token) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {image && <p className="text-4xl">
        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={image} alt={`${name}'s profile`} />
      </p>}
      <p>{t('intro.hi', { name })}</p>
      <p className="text-sm opacity-50">
        <em>{t('intro.demo-login')}</em>
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
