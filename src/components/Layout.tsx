import { signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { trpc } from '../utils/trpc';
import { BurgerDropDown, Button, NavigationButton } from './Buttons';

const Layout = ({ children }: { children: any }) => (
  <>
    <Head>
      <title>Daily Trivia</title>
      <meta name="description" content="Daily trivia questions" />
    </Head>
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full flex-1 bg-background p-4">
        {children}
      </main>
    </div>
  </>
);

export default Layout;

const Navbar = () => (
  <nav className="flex h-14 w-screen items-center gap-2 bg-background p-4 pb-0 md:h-16">
    <BurgerMenu />
    <h1 className="grow font-['Squada_One'] text-3xl uppercase leading-none text-accent md:text-4xl">
      <Link href="/">Daily trivia </Link>
    </h1>
    <div className="flex h-full justify-end">
      <ProfileButton />
    </div>
  </nav>
);

const BurgerMenu = () => (
  <BurgerDropDown>
    <div className="flex w-full flex-col whitespace-nowrap rounded bg-action-regular">
      <NavigationButton title="Home" href="/" />
      <hr className="border-gray-400" />
      <NavigationButton title="Trivia" href="/trivia" />
      <hr className="border-gray-400" />
      <NavigationButton title="Geography" subTitle="Coming Soon!" href="/geo" disabled />
    </div>
  </BurgerDropDown>
);

const ProfileButton = () => {
  const sessionQuery = trpc.proxy.auth.getSession.useQuery();
  if (sessionQuery.isLoading) return <LoadingIcon />;
  const session = sessionQuery.data;
  if (!session) return <SignInButton />;

  return (
    <div className="aspect-square h-full">
      <button type="button" className="relative aspect-square h-full overflow-hidden rounded-full" onClick={() => signOut()}>
        <Image
          layout="fill"
          objectFit="contain"
          src={session.user?.image as string}
        />
      </button>
    </div>
  );
};

const SignInButton = () => (
  <Button onClick={() => signIn('google')} paddingClass="p-2">
    <p className="flex h-full items-center whitespace-nowrap px-2 font-semibold leading-none text-gray-700">Sign in</p>
  </Button>
);

const LoadingIcon = () => (
  <div className="aspect-square h-full">
    <div className="h-full w-full animate-spin rounded-full border-2 border-t-accent" />
  </div>
);
