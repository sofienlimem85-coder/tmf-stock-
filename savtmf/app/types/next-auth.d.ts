import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "viewer";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "admin" | "viewer";
  }
}
