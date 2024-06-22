import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, children, sticky = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRootRoute = location.pathname === '/';

  const BackButton = (
    <button onClick={() => navigate(-1)} className="flex items-center">
      <span className="material-symbols-rounded size-6 text-2xl leading-none text-slate-800">
        arrow_back
      </span>
    </button>
  );

  const Title = (
    <h1 className="truncate text-2xl font-semibold leading-normal text-slate-800">
      {title}
    </h1>
  );

  return (
    <header
      className={clsx('flex flex-row items-center gap-4', {
        'sticky top-0': sticky,
      })}
    >
      {!isRootRoute && BackButton}
      {Title}
      {children}
    </header>
  );
};

export default Header;
