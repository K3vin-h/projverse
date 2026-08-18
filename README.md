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
