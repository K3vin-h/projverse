import { withAuth } from "next-auth/middleware";
//the middleware purpose is to protect the dashboard route, so only logged in users can access it
//if the user is not logged in, it will redirect to the login page
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
