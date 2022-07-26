import { signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

const Layout = ({ children }: { children: any }) => (
  <>
    <Head>
      <title>Daily Trivia</title>
      <meta name="description" content="Daily trivia questions" />
    </Head>
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full flex-1 bg-secondary-800 p-4">
        {children}
      </main>
    </div>
  </>
);

export default Layout;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex h-12 w-screen items-center gap-2 bg-primary-600 p-1 px-2">
      <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <h1 className="font-['Squada_One'] text-3xl uppercase text-secondary-800">
        <Link href="/">Daily trivia </Link>
      </h1>
      <div className="flex h-full flex-1 justify-end">
        <ProfileButton />
      </div>
    </nav>
  );
};

const BurgerMenu = ({ setIsOpen, isOpen }: {
  setIsOpen: (isOpen: boolean) => void,
  isOpen: boolean,
}) => (
  <button type="button" className="flex aspect-square h-full items-center justify-center rounded-sm bg-accent-200 text-secondary-800 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
    <span className="sr-only">Open main menu</span>
    <div className="relative w-4/6">
      <BurgerLine animationClass={isOpen ? 'rotate-45' : '-translate-y-1.5'} />
      <BurgerLine animationClass={isOpen && 'opacity-0'} />
      <BurgerLine animationClass={isOpen ? '-rotate-45' : 'translate-y-1.5'} />
    </div>
  </button>
);

const BurgerLine = ({ animationClass }: { animationClass: string | boolean }) => (
  <span aria-hidden="true" className={`absolute block h-0.6 w-full bg-current transition duration-500 ease-in-out ${animationClass}`} />
);

const ProfileButton = () => {
  const sessionQuery = trpc.proxy.auth.getSession.useQuery();
  if (sessionQuery.isLoading) return <LoadingIcon />;
  const session = sessionQuery.data;
  if (!session) return <SignInButton />;

  return (
    <button type="button" className="relative aspect-square h-full overflow-hidden rounded-full" onClick={() => signOut()}>
      <Image
        layout="fill"
        objectFit="contain"
        src={session.user?.image as string}
      />
    </button>
  );
};

const SignInButton = () => (
  <button type="button" className="h-full rounded-sm bg-amber-200 px-2 font-bold text-black" onClick={() => signIn('google')}>Sign in</button>
);

const LoadingIcon = () => (
  <div className="aspect-square h-full animate-spin rounded-full border-2 border-t-accent-500" />
);
