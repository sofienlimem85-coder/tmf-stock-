import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ⚠️ Fonction provisoire à remplacer par ta vraie DB
async function getUserByEmail(email: string) {
  if (email === "admin@tmf.com") {
    return { id: "1", email, name: "Admin", password: "123456", role: "admin" };
  }
  if (email === "user@tmf.com") {
    return { id: "2", email, name: "Viewer", password: "123456", role: "viewer" };
  }
  return null;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials!.email);

        if (!user) return null;
        if (user.password !== credentials!.password) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // stockage du rôle dans le token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // transfert token → session
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


