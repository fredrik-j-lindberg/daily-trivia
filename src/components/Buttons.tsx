import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

export const Button = ({ label, onClick, color }: {
  label?: string,
  onClick?: (buttonLabel: string) => void,
  color?: string
}) => (
  <div className="h-full w-full text-lg leading-none">
    {!label
      ? <Skeleton className="h-full p-4" highlightColor="lightgray" />
      : (
        <button
          className={`${color || 'bg-cyan-600 hover:brightness-110'} h-full w-full rounded-lg p-4 text-white transition-colors duration-300`}
          type="button"
          onClick={() => onClick?.(label)}
          disabled={!onClick}
        >
          {label}
        </button>
      )}
  </div>
);
Button.defaultProps = {
  label: null,
  onClick: null,
  color: null,
};

export const NavigationButton = ({
  name,
  description,
  href,
}: {
  name: string,
  description: string,
  href: string
}) => (
  <Link href={href}>
    <section className="flex cursor-pointer flex-col justify-center rounded border-2 border-white bg-accent-200 p-6 shadow-xl duration-500 hover:bg-accent-300 motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </section>
  </Link>
);
