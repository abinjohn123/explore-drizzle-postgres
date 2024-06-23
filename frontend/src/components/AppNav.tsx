import { NavLink } from 'react-router-dom';

const AppNav: React.FC = () => {
  return (
    <nav className="-mx-4 inline-flex items-center justify-between gap-6 border-t border-solid border-slate-200 px-6 pt-4">
      <NavLink to="/">
        <span className="material-symbols-rounded text-3xl leading-none text-slate-800">
          home
        </span>
      </NavLink>

      <NavLink to="/exercises">
        <span className="material-symbols-rounded text-3xl leading-none text-slate-800">
          exercise
        </span>
      </NavLink>

      <NavLink
        to="/profile"
        aria-disabled={true}
        className="pointer-events-none opacity-50"
      >
        <span className="material-symbols-rounded text-3xl leading-none text-slate-800">
          person
        </span>
      </NavLink>
    </nav>
  );
};

export default AppNav;
