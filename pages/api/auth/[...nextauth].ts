import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient, User } from "@prisma/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

const prisma = new PrismaClient()

export default NextAuth({
   adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         name: "Email and password",
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
   session: { strategy: "jwt" },
   callbacks: {
      // async redirect({ url, baseUrl }) {
      //    return baseUrl
      // },
      async session({ session }) {
         return session
      },
   },
})