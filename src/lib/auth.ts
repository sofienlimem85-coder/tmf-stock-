import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export type AppUser = User & {
  role: "admin" | "viewer";
  passwordHash: string;
};

const seededUsers: AppUser[] = [
  {
    id: "admin-ines",
    name: "Inès (Admin)",
    email: "admin1@tmf.local",
    role: "admin",
    passwordHash: "$2b$10$ZF.lJOSic1G6t0Fz4kpqkOvND1GPtb1zgm51km/SABo9DECZ9dxLy"
  },
  {
    id: "admin-samir",
    name: "Samir (Admin)",
    email: "admin2@tmf.local",
    role: "admin",
    passwordHash: "$2b$10$qRzzntwm4RKWL7EwGNwIyu44b/jx79K34yIjWMO9Dczo4lrSvd.lm"
  },
  {
    id: "viewer-amel",
    name: "Amel (Lecture)",
    email: "viewer@tmf.local",
    role: "viewer",
    passwordHash: "$2b$10$bqiteeQBUrQOkGvorE4N.OiZr554bsu88uCPBkiFIVCdJe6bxq7oe"
  }
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Compte TMF",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin1@tmf.local" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = seededUsers.find((candidate) =>
  candidate.email?.toLowerCase() === credentials.email?.toLowerCase()?.trim()
);

if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AppUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin" | "viewer") ?? "viewer";
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in"
  }
};

