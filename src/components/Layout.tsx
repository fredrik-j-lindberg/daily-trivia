import { signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import { trpc } from '../utils/trpc';
import { Button, NavigationButton } from './Buttons';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex h-14 w-screen items-center gap-2 bg-background p-4 pb-0 md:h-16">
      <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <h1 className="grow font-['Squada_One'] text-3xl uppercase leading-none text-accent md:text-4xl">
        <Link href="/">Daily trivia </Link>
      </h1>
      <div className="flex h-full justify-end">
        <ProfileButton />
      </div>
    </nav>
  );
};

const BurgerMenu = ({ setIsOpen, isOpen }: {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) => {
  const ref = useClickOutside<HTMLButtonElement>(() => setIsOpen(false));
  return (
    <div className="aspect-square h-full">
      <Button onClick={() => setIsOpen(!isOpen)} paddingClass="p-2" ref={ref}>
        <span className="sr-only">Open main menu</span>
        <div className="relative">
          <BurgerLine animationClass={isOpen ? 'rotate-45' : '-translate-y-2'} />
          <BurgerLine animationClass={isOpen && 'opacity-0'} />
          <BurgerLine animationClass={isOpen ? '-rotate-45' : 'translate-y-2'} />
        </div>
      </Button>
      <MenuContent isOpen={isOpen} />
    </div>
  );
};

const BurgerLine = ({ animationClass }: { animationClass: string | boolean }) => (
  <span aria-hidden="true" className={`absolute block h-0.8 w-full bg-current transition duration-500 ease-in-out ${animationClass}`} />
);

const MenuContent = ({ isOpen }: {
  isOpen: boolean;
}) => (
  <div className="absolute left-0 w-screen">
    <div className={`absolute top-2 w-full rounded px-2 md:w-2/4 xl:w-1/3 ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="flex w-full flex-col whitespace-nowrap rounded bg-action-regular">
        <NavigationButton title="Home" href="/" />
        <hr className="border-gray-400" />
        <NavigationButton title="Trivia" href="/trivia" />
        <hr className="border-gray-400" />
        <NavigationButton title="Geography" subTitle="Coming Soon!" href="/geo" disabled />
      </div>
    </div>
  </div>
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
  <button type="button" className="h-full whitespace-nowrap rounded-sm bg-amber-200 px-2 font-semibold text-black" onClick={() => signIn('google')}>Sign in</button>
);

const LoadingIcon = () => (
  <div className="aspect-square h-full">
    <div className="h-full w-full animate-spin rounded-full border-2 border-t-accent" />
  </div>
);
