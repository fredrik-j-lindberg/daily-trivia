import type { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { NavigationButton } from '../components/Buttons';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const sessionQuery = trpc.proxy.auth.getSession.useQuery();
  const session = sessionQuery.data;

  return (
    <div className="m-auto flex w-full flex-col items-center text-center text-secondary-100">
      <h1 className="mb-2 text-5xl font-extrabold leading-none md:text-[5rem]">
        Hello{session && <span className="text-primary-300"> {session.user?.name}</span>}!
      </h1>
      <p className="text-2xl">
        What are you in the mood for today?
      </p>
      <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-2 lg:w-2/3">
        <NavigationButton
          name="Trivia"
          description="Your daily trivia questions"
          href="/trivia"
        />
        <NavigationButton
          name="Geography"
          description="Your daily geography questions"
          href="/geo"
        />
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
