import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/server/lib/mongodb";
import User from "@/server/models/User";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase()?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        await connectDB();
        const user = await User.findOne({ email });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email,
          image: user.image || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email || account?.provider === "credentials") {
        return true;
      }

      await connectDB();
      const email = user.email.toLowerCase().trim();
      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        existingUser = await User.create({
          email,
          name: user.name || email,
          image: user.image || null,
          provider: account?.provider || "oauth",
        });
      }

      user.id = existingUser._id.toString();
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
      }
      if (session?.user && token?.provider) {
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
