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
