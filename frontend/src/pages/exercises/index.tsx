import { Outlet } from 'react-router-dom';

import DatePill from '@/components/DatePill';
import Header from '@/components/Header';

const Exercises: React.FC = () => {
  return (
    <>
      <Header title="Exercises">
        <DatePill />
      </Header>

      <Outlet />
    </>
  );
};

export default Exercises;
