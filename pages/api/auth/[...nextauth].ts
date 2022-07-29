import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@lib/prisma"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

const timeAlive = 15 * 60 // Session will be idle after 15min of inactivity

export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         name: "emailAndPassword",
         credentials: {
            email: { label: "Email", type: "email", "placeholder": "email@email.com" },
            password: { label: "Password", type: "password" }
         },
         async authorize(credentials): Promise<User | null> {
            try {
               if (!credentials) return null

               const user = await prisma.user.findUnique({ where: { email: credentials.email } })
               if (!user) return null

               const isPasswordCorrect = await bcrypt.compareSync(credentials.password, user.password)
               if (isPasswordCorrect) return user

               else return null

            } catch (err) {
               console.error(err.message)
               return null
            }
         }
      })
   ],
   pages: { signIn: "/auth/login", error: "auth/login", signOut: "/auth/logout" },
   session: {
      strategy: "jwt",
      maxAge: timeAlive
   },
   callbacks: {
      async redirect(data) {
         return `${data.baseUrl}/admin/tickets`
      },
      async session({ session }): Promise<Session> {
         try {
            if (session.user && session.user.email) {
               const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
               if (!currentUser) return session

               session.user.id = currentUser.id
               session.user.imageUrl = currentUser.imageUrl
               return session

            } else return session

         } catch (err) {
            console.error(err.message)
            return session
         }
      },
   },
}

export default NextAuth(authOptions)