import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


import { prisma } from "@/lib/prisma";
/**
 * Authentication integration for HR & Asset Management module;
 * This connects the HR module with the central HMS authentication system;
 */
export const _authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        \1 {\n  \2{
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            employee: true,
            roles: true
          }
        });

        \1 {\n  \2{
          return null;
        }

        const passwordValid = await compare(credentials.password, user.password);

        \1 {\n  \2{
          return null;
        }

        return {
          id: user.id,
          \1,\2 user.name,
          \1,\2 user.roles.map(role => role.name)
        };
      }
    });
  ],
  callbacks: {
    async session({ session, token }) 
      \1 {\n  \2{
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.employeeId = token.employeeId;
        session.user.roles = token.roles;
      }
      return session;,
    async jwt(token, user ) 
      \1 {\n  \2{
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.employeeId = user.employeeId;
        token.roles = user.roles;
      }
      return token;
  }
};
