import Link from 'next/link';
import { MouseEvent, ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';

export const Button = ({
  children, onClick, color, loading, disabled,
}: {
  children?: ReactNode;
  onClick?: (event: MouseEvent) => void;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
}) => (
  <div className="h-full w-full text-lg leading-none">
    {loading
      ? <Skeleton className="h-full p-4" highlightColor="lightgray" />
      : (
        <button
          className={`${color || 'bg-action-regular betterhover:hover:bg-action-hover motion-safe:betterhover:hover:scale-[1.02]'} h-full w-full rounded p-4 font-semibold text-black transition-all duration-300`}
          type="button"
          onClick={onClick}
          disabled={disabled || !onClick}
        >
          {children}
        </button>
      )}
  </div>
);
Button.defaultProps = {
  children: null,
  onClick: null,
  color: null,
  loading: false,
  disabled: false,
};

export const NavigationButton = ({
  title,
  subTitle,
  href,
  disabled,
  paddingClass,
}: {
  title: string;
  subTitle?: string;
  href: string;
  disabled?: boolean;
  paddingClass?: string;
}) => (
  <Link href={href}>
    <Button disabled={disabled} color={(disabled && 'bg-disabled') || undefined}>
      <div className={paddingClass}>
        <p className="text-lg font-semibold text-gray-700">{title}</p>
        {subTitle && <p className="text-sm text-gray-600">{subTitle}</p>}
      </div>
    </Button>
  </Link>
);
NavigationButton.defaultProps = {
  disabled: false,
  subTitle: null,
  paddingClass: null,
};
