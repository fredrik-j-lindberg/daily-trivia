import Link from 'next/link';
import {
  forwardRef, MouseEvent, ReactNode, useState,
} from 'react';
import Skeleton from 'react-loading-skeleton';
import useClickOutside from '../hooks/useClickOutside';

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

export const BurgerDropDown = ({ children }: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="absolute left-0 z-30 w-screen p-2">
        <div className={`w-full min-w-[300px] rounded sm:w-1/3 ${isOpen ? 'flex' : 'hidden'} shadow-2xl shadow-background`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const BurgerLine = ({ animationClass }: { animationClass: string | boolean }) => (
  <span aria-hidden="true" className={`absolute block h-0.8 w-full bg-current transition duration-500 ease-in-out ${animationClass}`} />
);
