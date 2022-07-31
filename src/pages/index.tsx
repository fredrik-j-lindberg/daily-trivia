import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { NavigationButton } from '../components/Buttons';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const sessionQuery = trpc.proxy.auth.getSession.useQuery();
  const session = sessionQuery.data;

  return (
    <div className="m-auto flex w-full flex-col items-center pb-32 text-center text-white md:pb-64">
      <h1 className="mb-2 text-5xl font-extrabold leading-none md:text-[5rem]">
        Hello{session && <span className="text-accent"> {session.user?.name}</span>}!
      </h1>
      <p className="text-2xl">
        What are you in the mood for today?
      </p>
      <div className="mt-6 flex w-full items-center justify-center">
        <div className="grid w-full gap-3 text-center md:grid-cols-2 lg:w-2/3 xl:w-2/4">
          <NavigationButton
            title="Trivia"
            subTitle="Your daily trivia questions"
            href="/trivia"
            paddingClass="p-8"
          />
          <NavigationButton
            title="Geography"
            subTitle="Coming soon!"
            href="/geo"
            disabled
            paddingClass="p-8"
          />
        </div>
      </div>
      {!session && !sessionQuery.isLoading && (
      <p className="mt-4 text-xl italic">
        <button
          type="button"
          className="italic text-link-400"
          onClick={() => signIn('google')}
        >Sign in
        </button> to be able to track your stats
      </p>
      )}
    </div>
  );
};

export default Home;
