import type { DefaultSession } from "next-auth";
//connecting the backend to the frontend
//session function is used to store the user session information and use it in the frontend
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
    } & DefaultSession["user"];
  }
}
//jwt function store user data between server and client, jwt is json web token and it is used to store the user data in the browser
declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
  }
}
