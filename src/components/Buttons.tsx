import Link from 'next/link';
import { MouseEvent } from 'react';
import Skeleton from 'react-loading-skeleton';

export const Button = ({
  title, subTitle, onClick, color,
}: {
  title?: string,
  subTitle?: string,
  onClick?: (event: MouseEvent, title: string) => void,
  color?: string
}) => (
  <div className="h-full w-full text-lg leading-none">
    {!title
      ? <Skeleton className="h-full p-4" highlightColor="lightgray" />
      : (
        <button
          className={`${color || 'bg-action-regular hover:bg-action-hover motion-safe:hover:scale-[1.02]'} h-full w-full rounded p-4 font-semibold text-black transition-all duration-300`}
          type="button"
          onClick={(e) => onClick?.(e, title)}
          disabled={!onClick}
        >
          <p className="text-lg font-semibold text-gray-700">{title}</p>
          {subTitle && <p className="text-sm text-gray-600">{subTitle}</p>}
        </button>
      )}
  </div>
);
Button.defaultProps = {
  title: null,
  subTitle: null,
  onClick: null,
  color: null,
};

export const NavigationButton = ({
  title,
  subTitle,
  href,
}: {
  title: string,
  subTitle: string,
  href: string
}) => (
  <Link href={href}>
    <Button title={title} subTitle={subTitle} />
  </Link>
);
