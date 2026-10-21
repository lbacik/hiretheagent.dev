This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Adding an Article

An Article is a Medium post by the page's author that is directly about
simple-coding-agent or this page. To add one:

1. Append to the list in `src/lib/articles.ts`, using the canonical Medium
   URL without the `?source=…` query.
2. Cut a Release.

## Newsletter (listmonk)

The Newsletter form subscribes visitors to a dedicated list on the
self-hosted listmonk instance (see ADR 0001). The page's server calls
listmonk synchronously from a Server Action; listmonk owns double opt-in
from there. Sign-ups are guarded by an ALTCHA proof-of-work bot check
(see ADR 0001): the page issues its own challenges and verifies them
locally, so no visitor data goes to any third party. Configure it with
five server-side env vars:

```bash
LISTMONK_URL=https://lists.example.com   # no trailing slash needed
LISTMONK_API_USER=listmonk-api-user
LISTMONK_API_TOKEN=…
LISTMONK_LIST_ID=7                        # the Newsletter list's id
ALTCHA_HMAC_KEY=…                         # signs the ALTCHA challenges (min. 16 chars recommended)
```

Behaviour to know:

- All five vars must be set, otherwise the form renders its disabled
  "Coming soon" state and no request is ever made.
- A duplicate address (409) shows the same "check your inbox" success as
  a new one; all failures show one generic "try again later" message.
- A submit without a valid ALTCHA solution (missing, tampered, expired,
  or replayed) shows "Verification failed, please try again." and never
  reaches the throttle or listmonk; each solved challenge works once.
- Credentials and the HMAC key never reach the browser: they are read
  from `process.env` in server code only. The widget ships in our own
  bundle (no CDN) and talks only to our same-origin challenge route.
