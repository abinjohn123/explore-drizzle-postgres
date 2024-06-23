import { Outlet } from 'react-router-dom';
import AppNav from './components/AppNav';

const App: React.FC = () => {
  return (
    <div className="mx-auto flex h-svh max-w-md flex-col bg-slate-50 p-4">
      <Outlet />
      <AppNav />
    </div>
  );
};

export default App;
