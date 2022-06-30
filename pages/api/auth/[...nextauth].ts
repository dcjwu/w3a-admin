import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User } from "@prisma/client"
import NextAuth, { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "@lib/prisma"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

export default NextAuth({
   adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         name: "emailAndPassword",
         credentials: {
            email: { label: "Email", type: "email", "placeholder": "email@email.com" },
            password: { label: "Password", type: "password" }
         },
         async authorize(credentials): Promise<User | null> {
            if (!credentials) return null

            const user = await prisma.user.findUnique({ where: { email: credentials.email } })

            if (!user) return null

            const isPasswordCorrect = await bcrypt.compareSync(credentials.password, user.password)

            if (isPasswordCorrect) return user
            else return null
         }
      })
   ],
   pages: { signIn: "/auth/login", error: "auth/login" },
   session: { strategy: "jwt" },
   callbacks: {
      async redirect(data) {
         return data.baseUrl
      },
      async session({ session }): Promise<Session> {
         return session
      },
   },
})