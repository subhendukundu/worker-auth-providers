import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../lib/providers/AuthProvider';

export default function Me() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>({});
  const { name, image } = user;

  useEffect(() => {
    async function getUser() {
      const res = await fetch('/api/v1/user/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    }
    if (token) {
      getUser();
    } else {
      router.push('/');
    }
  }, [token]);

  function onLogout() {
    logout();
    router.push("/");
  }

  if (token === null) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <p className="text-4xl">
        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={image} alt={`${name}'s profile`} />
      </p>
      <p>Hi, {name}</p>
      <p className="text-sm opacity-50">
        <em>Enjoying worker-auth-providers?</em>
      </p>
      <div>
        <button
          className="btn m-3 text-sm mt-8"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
