import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "./lib/database";
import { usersTable } from "./lib/database/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, credentials.email),
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if user signed up with Google (no password set)
        if (!user.password) {
          throw new Error("Please sign in with Google");
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        // Ensure user.email exists
        if (!user.email) {
          throw new Error("Google account email is missing");
        }

        // Check if user exists
        const existingUser = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, user.email),
        });

        if (!existingUser) {
          await db.insert(usersTable).values({
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? "",
            provider: "google",
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
