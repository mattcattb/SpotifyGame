"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';

const HomePage = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to the Spotify Game</h1>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
          <Link href="/game">Start the Game</Link>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>
        </>
      )}
    </div>
  );
};

export default HomePage;