import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Connect to your database
        const user = await getUserByEmail(credentials.email)
        
        if (!user) {
          throw new Error("No user found with this email")
        }
        
        // Check if user signed up with Google (no password set)
        if (!user.password) {
          throw new Error("Please sign in with Google")
        }
        
        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error("Invalid password")
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Check if user exists, if not create them
        const existingUser = await getUserByEmail(user.email)
        
        if (!existingUser) {
          await createUser({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: "google"
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

// For App Router, also export:
export { authOptions as GET, authOptions as POST }