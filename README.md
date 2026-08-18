# ProjVerse

This project is designed to be a showcase website, where users (developers) can showcase their projects with the public. The public can view the projects, like them, comment on them, and view the details of the projects' GitHub details (stars, forks, recent commits, etc).

## Table of Contents

- [Structure](#structure)
- [Database](#database)
  - [User Model](#user-model)
  - [Account Model](#account-model)
  - [Session and Verification Token Models](#session-and-verification-token-models)
  - [Project Model](#project-model)
  - [Like and Comment Models](#like-and-comment-models)
  - [Migrations](#migrations)
  - [Prisma Config](#prisma-config)
  - [Prisma Client Singleton](#prisma-client-singleton)
- [Auth](#auth)
  - [GitHub OAuth](#github-oauth)
  - [Credentials](#credentials)
  - [Session Strategy (JWT)](#session-strategy-jwt)
  - [Type Augmentation](#type-augmentation)
  - [Server vs. Client Session Access](#server-vs-client-session-access)
- [Middleware](#middleware)

## Structure

The project is built using React JS and Tailwind CSS through the Next.js framework. The database uses Postgres through the Prisma ORM. The authentication uses the standard NextAuth library V4, with password hashing done through bcrypt.

The whole project is one big Next.js application, where the backend and frontend are in the same project. There are two main components: server and client. The server components run on the server side (backend), while the client components run on the client side (frontend). We differentiate between the two by the use of the `"use client"` directive.

## Database

Prisma is used to interact with the database, using the `prisma-client-js` provider, and the data source being a Postgres database hosted on Neon. There are seven models: `User`, `Account`, `Session`, `VerificationToken`, `Project`, `Like`, and `Comment`.

### User Model

The user model is the main model, which is used to store all the user's information. The model also contains relation fields to other models, which act as a shortcut to access other models' data. This means that we can access the user's projects, comments, likes, etc. without having to query the other models separately.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  email         String?   @unique
  emailVerified DateTime? // This has not been implemented
  password      String?   // The password is stored hashed in the database
  image         String?
  bio           String?
  github        String?
  website       String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  projects  Project[]
  likes     Like[]
  comments  Comment[]
}
```

### Account Model

The account model is used to store the user's third-party authentication details, such as using GitHub to log into the account. The model is based upon the NextAuth Prisma adapter.

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // The type of the account (e.g. "oauth", "credentials")
  provider          String  // The third-party authentication provider
  providerAccountId String  // The id of the user on the third-party authentication provider
  refresh_token     String? @db.Text // The refresh and access tokens are produced by the third-party authentication provider
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String? // How the token should be used
  scope             String? // The permissions granted
  id_token          String? @db.Text // The id token is used to verify the user's identity. This won't be used in GitHub OAuth.
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade) // If the user is deleted, the account is also deleted.

  @@unique([provider, providerAccountId]) // Ensures each user can only have one account per provider.
}
```

### Session and Verification Token Models

The session and verification token models are based upon the NextAuth Prisma adapter as well.

### Project Model

The project model is used to store any project-related information of the projects the user has created.

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  authorId    String
  repoUrl     String?
  demoUrl     String?
  docUrl      String?
  tags        String[] // Postgres allows for storing information in arrays. However, the tradeoff is that searching through arrays is not efficient for large datasets.
  languages   String[]
  screenshots String[]
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade) // If the user is deleted, the project is also deleted.
  likes    Like[]     // A project can have multiple likes from different users.
  comments Comment[]  // A project can have multiple comments from different users.
}
```

### Like and Comment Models

The like and comment models are very similar, where they store the user's id and the project's id. The like model also stores the created-at date and time. The comment model also stores the content of the comment. Both models have cascade delete relationships with the user and project models, meaning that if the user or project is deleted, the like or comment is also deleted.

```prisma
model Like {
  id        String   @id @default(cuid())
  userId    String
  projectId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId])
}
```

```prisma
model Comment {
  id        String   @id @default(cuid())
  userId    String
  projectId String
  content   String   @db.Text
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### Migrations

When the Prisma schemas (database models) are updated, the Postgres database is automatically updated through the `prisma migrate` command, which creates a new migration file stored in the `prisma/migrations` folder. This migration file contains the changes to the database schema, and is used to update the database to be in line with the Prisma schemas.

### Prisma Config

The Prisma config file is used to configure the Prisma client by specifying the data source, file location of schema files, location of migration path, and the provider. The classic engine is used instead of the newer WASM-based engine because we are using the traditional `prisma-client-js` provider for Node.js, rather than the newer engine-less provider built for edge runtimes.

### Prisma Client Singleton

One issue when working with Next.js development mode is that the Prisma client would constantly refresh, resulting in unnecessary new database connections due to a new Prisma client being created after each Next.js reload. To resolve this issue, the `lib/prisma.ts` file checks if the Prisma client is already initialized on the `globalThis` object (the global object that does not get reset after each Next.js reload). If the Prisma client already exists on the `globalThis` object, it is returned instead of creating a new one. Note that this file only checks for the Prisma client on the `globalThis` object when in development mode. Other files import the Prisma client from the `lib/prisma.ts` file instead of directly importing the Prisma client from the `prisma-client-js` provider, to avoid the issue as well.

## Auth

The application's authentication is handled using the NextAuth library v4. User and session data are saved to the Postgres database through the Prisma adapter instead of the default in-memory storage. There are two authentication methods: GitHub OAuth and credentials (email and password). The authentication configuration is stored in the `lib/auth.ts` file.

### GitHub OAuth

The user is redirected to the GitHub OAuth page to authenticate. Once authenticated, the user is redirected back to the application with an authorization code. This code is exchanged for an access token, which is then used to fetch the user's information from the GitHub API and store it in the database via the Prisma adapter.

### Credentials

The user logs in using their email and password. The password is hashed using bcrypt before being saved to the database. When checking the password on login, the submitted password is hashed and compared against the hashed password stored in the database.

The user is brought to a custom-designed login page instead of the default NextAuth login page.

The credentials sign-up process is handled by the `app/api/register/route.ts` file. This file handles registration for new users: the provided information is checked for validity (e.g. ensuring all fields are filled, and that the email is valid and not already in use), and the user's information is then stored in the database via the Prisma adapter. The password is hashed using bcrypt and undergoes 2^12 rounds of hashing before being stored. Once the user is registered, they are redirected to the login page along with a success message confirming their account has been created (201 status code).

### Session Strategy (JWT)

Session data is stored as a signed JSON Web Token (JWT) in the browser's cookies, instead of using a database session. This avoids having to constantly query the database for session data, since the JWT itself is stored client-side. The JWT can't be tampered with because it is signed with the app's NextAuth secret key, which is used to sign and verify every token.

The only downside of this approach is that if the user's information changes in the database after logging in, the changes won't be reflected in their session until they log in again — the JWT is only generated or refreshed when the user signs in, or when their session expires.

On the first sign-in, the app queries the database for the user's information and stores the relevant fields in the JWT. On later requests, only the JWT is used to authenticate the user, and the database is not queried again.

The authentication process itself is handled by the `app/api/auth/[...nextauth]/route.ts` file. This file routes all authentication endpoints through NextAuth's built-in API handler, using the options configured in `lib/auth.ts`.

### Type Augmentation

The standard NextAuth session fields do not include the user's `username` or `id`. The `types/next-auth.d.ts` file augments NextAuth's built-in types to add these fields to the `Session` and `JWT` types. This prevents TypeScript from throwing an error when accessing the user's `username` and/or `id` on the session or token.

### Server vs. Client Session Access

The session is read differently depending on where the code runs:

- **Server-side** — `getServerSession(authOptions)` is used in API routes and server components. It runs on the server and returns the session data directly, with no re-rendering involved.
- **Client-side** — the `useSession()` hook is used in client components. It's reactive: the hook automatically updates the page to match the current login state and user information whenever it changes.

## Middleware

The middleware (`middleware.ts`) uses NextAuth's `withAuth` helper to protect the dashboard route, so only logged-in users can access it. It checks whether the user is logged in by verifying the JWT stored in the request's cookies. If the user is not logged in, they are redirected to the login page. The middleware is configured to protect all routes under the `/dashboard` path only.
