import { prisma } from '@repo/db'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'yourEmail@test.com',
        },
        password: { label: 'Password', type: 'password' },
        demo: {},
      },
      async authorize(credentials, req) {
        // Demo Login
        if (credentials?.demo === 'true') {
          const demoUser = await prisma.user.findUnique({
            where: {
              email: 'demo@klyro.com',
            },
          })

          return demoUser
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isValid) {
          return null
        }

        // Success → return SAFE user
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true
      }

      let dbUser = await prisma.user.findUnique({
        where: {
          email: user.email!,
        },
      })

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            avatar: user.image,
            password: null,
            provider: 'google',
          },
        })
      }

      // replaced userId with database id of user
      ;(user as typeof user & { id: string }).id = dbUser.id
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT CALLBACK HIT' + JSON.stringify(user) + '-----', token)
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      console.log('session', session)
      //@ts-ignore
      session.user.id = token.id
      return session
    },
  },
}
