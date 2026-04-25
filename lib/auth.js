import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const username = user.email?.split("@")[0] || "user";
          const newUser = await User.create({
            username,
            email: user.email,
            passwordHash: null,
            provider: "google",
            avatar: user.image || "",
            lastActive: new Date(),
          });
          user.id = newUser._id.toString();
        } else {
          await User.findByIdAndUpdate(existingUser._id, {
            lastActive: new Date(),
          });
          user.id = existingUser._id.toString();
        }
      } else if (account?.provider === "credentials") {
        await User.findOneAndUpdate(
          { email: user.email },
          { lastActive: new Date() }
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findById(user.id);
        
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.rank = dbUser.rank;
          token.xp = dbUser.xp;
          token.isAdmin = dbUser.isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.rank = token.rank;
        session.user.xp = token.xp;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
