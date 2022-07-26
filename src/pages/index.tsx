import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const hello = trpc.proxy.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <div className="m-auto flex flex-col items-center">
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
        Create <span className="text-purple-300">T3</span> App
      </h1>
      <p className="text-2xl text-gray-700">This stack uses:</p>
      <div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-2 lg:w-2/3">
        <TechnologyCard
          name="NextJS"
          description="The React framework for production"
          documentation="https://nextjs.org/"
        />
        <TechnologyCard
          name="TypeScript"
          description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
          documentation="https://www.typescriptlang.org/"
        />
        <TechnologyCard
          name="TailwindCSS"
          description="Rapidly build modern websites without ever leaving your HTML"
          documentation="https://tailwindcss.com/"
        />
        <TechnologyCard
          name="tRPC"
          description="End-to-end typesafe APIs made easy"
          documentation="https://trpc.io/"
        />
      </div>
      <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
        {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
      </div>
    </div>
  );
};

export default Home;

// Technology component
interface TechnologyCardProps {
  name: string;
  description: string;
  documentation: string;
}

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => (
  <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
    <h2 className="text-lg text-gray-700">{name}</h2>
    <p className="text-sm text-gray-600">{description}</p>
    <a
      className="mt-3 text-sm text-violet-500 underline decoration-dotted underline-offset-2"
      href={documentation}
      target="_blank"
      rel="noreferrer"
    >
      Documentation
    </a>
  </section>
);
