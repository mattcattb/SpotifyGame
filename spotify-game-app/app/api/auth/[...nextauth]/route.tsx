import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { NextAuthOptions } from 'next-auth';

// Create the NextAuth configuration
const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-read-email user-read-private user-top-read user-read-recently-played",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user!.accessToken = token.accessToken;
      return session;
    },
  },
};

export { options as GET, options as POST }