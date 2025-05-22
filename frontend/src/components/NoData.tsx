import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const NoDataFullScreen: React.FC<{
  children: ReactNode;
  icon?: string;
  className?: string;
}> = ({ icon, children, className }) => {
  return (
    <div
      className={twMerge(
        'flex w-full flex-col items-center justify-center gap-2 py-4 text-center',
        className,
      )}
    >
      {icon && (
        <span className="material-symbols-rounded text-2xl leading-none text-slate-500">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
};
