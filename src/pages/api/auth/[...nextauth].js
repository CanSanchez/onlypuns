import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../../server/db/client"

const secret = process.env.NEXTAUTH_SECRET

console.log("GITHUB_ID:", process.env.GITHUB_ID)
console.log("GITHUB_SECRET:", process.env.GITHUB_SECRET)
console.log("process.env.DATABASE_URL", process.env.VERCEL_POSTGRESQL_URL)


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  secret,
}

export default NextAuth(authOptions)
