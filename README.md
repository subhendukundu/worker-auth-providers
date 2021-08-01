<p align="center"><img src="/logo.png" alt="worker-auth-providers" width="120px"></p>

<h1 align="center">worker-auth-providers</h1>

<p align="center">
An open-source auth providers for <a href="https://workers.cloudflare.com/">Cloudflare's workers</a>
</p>

<p align="center">
<img src="https://img.shields.io/github/repo-size/subhendukundu/worker-auth-providers?color=%23DA631D&label=Repo%20Size" alt="Repo Size">

<img src="https://img.shields.io/github/issues/subhendukundu/worker-auth-providers?color=%23DA631D&label=Issues" alt="Issues">

<img src="https://img.shields.io/github/issues-pr/subhendukundu/worker-auth-providers?color=%23DA631D&label=Pull%20Requests" alt="Pull Requests">

<img src="https://img.shields.io/github/last-commit/subhendukundu/worker-auth-providers?color=%23DA631D&label=Last%20Commit" alt="Last Commit">


</p>
worker-auth-providers is an open-source providers to make authentication easy with workers. Very lightweight script which doesn't need a lot of dependencies. Plug it with any framework or template of workers.

## 🚀 Demo
Coming soon!

## 🧐 Features
- Open Source
- Fast & Lightweight
- Easy


## 🛠️ Installation
**Step 1**: Install the dependencies
```bash
npm install worker-auth-providers
```
**Step 2**: Import the dependencies
```javascript
import { github, google, awsSNS } from "worker-auth-providers";
```
**Step 3**: Redirect users
```javascript
const githubLoginUrl = await github.redirect({
    options: {
        clientId,
    },
});
return {
    status: 302,
    headers: {
        location: githubLoginUrl,
    },
};

// or send otp

const res = await awsSNS.send({
  options: {
    phone,
    region: 'ap-south-1',
    kvProvider: WORKER_AUTH_PROVIDERS_STORE,
  },
})
```
**Step 4**: Get user
```javascript
const { user: providerUser, tokens } = await github.users({
    options: { clientSecret, clientId },
    request,
});
console.log("[providerUser]", providerUser);

// or verify otp
const res = await awsSNS.verify({
  options: {
    phone,
    otp,
    kvProvider: WORKER_AUTH_PROVIDERS_STORE,
    secret: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjE2Mjc4MTE1MDEiLA0KICAibmFtZSI6ICJoYWFsLmluIiwNCiAgImlhdCI6ICIwMTA4MjAyMCINCn0.aNr18szvBz3Db3HAsJ-2KHYbnnHwHfK65CiZ_AWwpc0',
  },
})
```

## 📃 Documentation
Coming soon

## 👩‍💻 Tech
- [Cloudflare](https://www.cloudflare.com/)

## 🍰 Contributing
Contributions are always welcome!
See [contributing.md](contributing.md) for ways to get started.
Please adhere to this project's [code of conduct](code-of-conduct.md).


## Roadmap

- [ ] Docs.
- [x] Google.
- [x] Github
- [ ] OTP AWS SNS
- [ ] OTP Twilio
- [ ] Twitter
- [ ] Spotify
- [ ] Auth0


##FAQs

#### How to persist login?

Use cookie. Setting a cookie to indicate that they’re authorized for future requests

```javascript
const cookieKey = "worker-auth-providers"
const persistAuth = async exchange => {
    const date = new Date()  date.setDate(date.getDate() + 1)
    const headers = { 
      Location: "/",
      "Set-cookie": `${cookieKey}=${id}; Secure; HttpOnly; SameSite=Lax; Expires=${date.toUTCString()}`,
    }
    return { headers, status: 302 }
}
```

#### How to logout?

Easy, delete the cookie

```javascript
export const logout = event => {
  const cookieHeader = event.request.headers.get('Cookie')
  if (cookieHeader && cookieHeader.includes(cookieKey)) {
    return {
      headers: {
        'Set-cookie': `${cookieKey}=""; HttpOnly; Secure; SameSite=Lax;`,
      },
    }
  }
  return {}
}
```

## Feedback

If you have any feedback, please reach out to us at subhendukundu14@gmail.com


## ✍️ Authors
- [@subhendukundu](https://www.github.com/subhendukundu)

## 💼 License
[MIT](https://github.com/subhendukundu/worker-auth-providers/blob/main/LICENSE)
