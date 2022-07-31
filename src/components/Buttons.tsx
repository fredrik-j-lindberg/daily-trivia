import Link from 'next/link';
import {
  forwardRef, MouseEvent, ReactNode,
} from 'react';
import Skeleton from 'react-loading-skeleton';

export const Button = forwardRef<HTMLButtonElement, {
  children?: ReactNode;
  onClick?:(event: MouseEvent) => void;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  paddingClass?: string;
}>(({
      children, onClick, color, loading, disabled, paddingClass,
    }, ref) => (
      <div className="h-full w-full text-lg leading-none">
        {loading
          ? <Skeleton className={`h-full ${paddingClass}`} highlightColor="lightgray" />
          : (
            <button
              ref={ref}
              className={`${color || 'bg-action-regular betterhover:hover:bg-action-hover motion-safe:betterhover:hover:scale-[1.02]'} h-full w-full rounded ${paddingClass} font-semibold text-black transition-all duration-300`}
              type="button"
              onClick={onClick}
              disabled={disabled || !onClick}
            >
              {children}
            </button>
          )}
      </div>
    ));
Button.defaultProps = {
  children: null,
  onClick: undefined,
  color: undefined,
  loading: false,
  disabled: false,
  paddingClass: 'p-4',
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
    <Button disabled={disabled} color={(disabled && 'bg-disabled') || undefined} paddingClass={paddingClass}>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      {subTitle && <p className="text-sm text-gray-600">{subTitle}</p>}
    </Button>
  </Link>
);
NavigationButton.defaultProps = {
  disabled: false,
  subTitle: null,
  paddingClass: 'p-4',
};
