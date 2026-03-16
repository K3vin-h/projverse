import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
//this is the authentication configuration, it is used to configure the authentication of the website, the sign in, sign up, and sign out
export const authOptions: NextAuthOptions = {
  //adapter is used to connect the authentication to the database
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  //providers are used to configure the authentication providers github
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    //credentials provider is used to authenticate users using email and password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      //authorize function is used to authenticate the user
      async authorize(credentials) {
        //check if the credentials are valid, else throw an error 
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        //find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        //check if the user is valid, else throw an error
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        //compare the password with the hashed password in the database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        //if the password does not match, throw an error
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  //pages is used to configure the authentication pages
  pages: {
    signIn: "/login",
  },
  //session is used to configure the session
  session: {
    strategy: "jwt",
  },
  //callbacks are used to configure the session and jwt
  callbacks: {
    async session({ session, token }) {
      //add the user id and username to the session
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
      }
      return session;
    },
    //jwt is used to configure user data in the browser
    async jwt({ token, user }) {
      //add the user id and username to the jwt
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        token.username = dbUser?.username ?? undefined;
      }
      return token;
    },
  },
  //secret is used to sign the jwt
  secret: process.env.NEXTAUTH_SECRET,
};
