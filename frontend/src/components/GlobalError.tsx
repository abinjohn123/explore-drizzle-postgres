import { ROUTES } from '@/routes';
import { useNavigate } from 'react-router-dom';

const GlobalError: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center gap-2 py-4 text-center">
      <span className="material-symbols-rounded text-2xl leading-none text-slate-500">
        error
      </span>
      <span className="text-sm text-slate-500">
        Something went wrong.
        <br />
        This page probably doesn't exist yet.
      </span>
      <button
        className="flex items-center justify-center gap-1 rounded bg-slate-700 p-2 pl-3 pr-4 text-center text-base font-semibold text-white"
        onClick={() => navigate(ROUTES.HOME)}
      >
        <span className="material-symbols-rounded text-xl leading-none text-white">
          arrow_back_ios
        </span>
        Go Home
      </button>
    </div>
  );
};

export default GlobalError;
