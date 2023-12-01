import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // pages: {
  //   signIn: "/sign-in",
  // },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },

      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const existingUser =  await db.user.findUnique({
            where: {email: credentials.email}
        })
        if (!existingUser) {
            return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password)
        if (!passwordMatch) {
            return null
        }

        return {
            id: existingUser.id,
            name: existingUser.username,
            email: existingUser.email,
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        console.log(user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
    
      }
      return token;
    },
    session({ session, token }) {
      return { ...session,
        user: { ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
        }
      }
    },
    },
};
