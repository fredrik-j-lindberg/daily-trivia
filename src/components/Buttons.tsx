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
          className={`${color || 'bg-action-regular hover:bg-action-hover motion-safe:hover:scale-[1.02]'} h-full w-full rounded p-4 font-semibold text-black transition-all duration-300`}
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
    <button
      type="button"
      className="flex cursor-pointer flex-col justify-center rounded bg-action-regular p-6 shadow-xl duration-500 hover:bg-action-hover motion-safe:hover:scale-[1.02]"
    >
      <h2 className="text-lg font-semibold text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  </Link>
);
