# Personal Book Manager

A full-stack app for tracking what you're reading, what you want to read, and what you've finished. Built with Next.js (App Router), MongoDB, and JWT-based auth.

**Live demo:** [personal-book-manager-z6mf.vercel.app](https://personal-book-manager-z6mf.vercel.app/login)

---

## Why this exists

I wanted a small, self-contained project to work through a full auth flow and CRUD lifecycle in the Next.js App Router — server components, route handlers, cookie-based sessions — without pulling in an auth-as-a-service provider. Books felt like a good domain: simple enough to not need a design doc, but enough real fields (status, tags, ownership) to force actual data modeling decisions.

## Features

- **Auth** — email/password signup and login, passwords hashed with bcrypt, sessions handled via a JWT stored in an `httpOnly`, `sameSite=strict` cookie (not localStorage, so it's not readable from client-side JS).
- **CRUD on books** — add, edit, delete, and update reading status. Every read/write is scoped to the logged-in user's `userId`, so there's no way to fetch or modify another user's data by guessing an ID.
- **Status tracking** — `WANT_TO_READ`, `READING`, `COMPLETED`, with quick-filter tabs.
- **Search** — client-side filtering across title, author, and tags as you type.
- **Dashboard stats** — total books, currently reading, completed, computed on the fly from the loaded list.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Database | MongoDB Atlas via Mongoose |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs`, httpOnly cookies |
| Hosting | Vercel |

## Project structure

```
app/
  api/
    auth/
      login/route.js     POST — verify credentials, issue JWT cookie
      signup/route.js    POST — create user, issue JWT cookie
      logout/route.js    POST — clear the cookie
      me/route.js         GET — return the current session's user
    books/
      route.js            GET/POST — list or create books for the current user
      [id]/route.js        PUT/DELETE — update or remove a single book (ownership-checked)
  login/page.js           Sign in / sign up form
  page.js                 Main dashboard (list, filters, search, add/edit modal)
lib/
  auth.js                 JWT sign/verify, reads the session from cookies
  db.js                   Cached Mongoose connection (avoids reconnecting per request in dev/serverless)
models/
  User.js                 Schema + validation for users
  Book.js                 Schema for books, indexed on userId
```

## API reference

All `/api/books*` routes require a valid session cookie and return `401` otherwise.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in, sets session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Return the current authenticated user |
| GET | `/api/books` | List the current user's books |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Update a book (must belong to current user) |
| DELETE | `/api/books/:id` | Delete a book (must belong to current user) |

## Getting started

**Prerequisites**
- Node.js 18+
- A MongoDB connection string (Atlas or local)

**Setup**

```bash
git clone https://github.com/kmassi69/personal-book-manager.git
cd personal-book-manager
npm install
```

Create a `.env.local` in the project root:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
```

`JWT_SECRET` has no fallback value on purpose — the app throws at build time if it's missing rather than silently signing tokens with a guessable default. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then run it:

```bash
npm run dev
```

The app will be at `http://localhost:3000`.

## Design notes / tradeoffs

- **JWT over sessions-in-DB**: simpler to run on a serverless platform where you don't want sticky sessions or an extra store — the tradeoff is that a token can't be revoked before it expires (7 days here). Fine for a personal project, not what I'd pick for anything handling sensitive data.
- **Ownership checks live in the query, not just in app logic** — routes filter by `{ _id, userId }` directly in the Mongoose query rather than fetching the book and checking `book.userId === user.id` afterward. One less place to get it wrong.
- **Search is client-side.** With a personal library (tens to low hundreds of books) that's plenty fast and avoids adding a text index for something this small. It would need to move server-side if the dataset ever got large.

## Possible next steps

- Rate limiting on `/api/auth/login` (currently none — brute-forcible)
- Move filtering/search server-side with pagination
- Cover images via a books API (Open Library / Google Books)
- Export library as CSV/JSON

## License

MIT
