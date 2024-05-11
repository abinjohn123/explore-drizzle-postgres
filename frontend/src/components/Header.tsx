import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, sticky = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRootRoute = location.pathname === '/';

  const BackButton = (
    <button onClick={() => navigate(-1)} className="flex items-center">
      <span className="material-symbols-rounded text-2xl text-slate-800 leading-none size-6">
        arrow_back
      </span>
    </button>
  );

  const Title = (
    <h1 className="text-2xl font-semibold truncate text-slate-800 leading-normal">
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
    </header>
  );
};

export default Header;
