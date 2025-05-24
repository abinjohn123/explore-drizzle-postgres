import { useAuthContext } from '@/auth';
import DatePill from '@/components/DatePill';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { getGreeting } from '@/utils';

const Profile: React.FC = () => {
  const { signOut } = useAuthContext();

  return (
    <div className="flex grow flex-col gap-4 ">
      <Header title={getGreeting()}>
        <DatePill />
      </Header>

      <Button variant="secondary" onClick={signOut} className="mb-4 mt-auto">
        Sign out
      </Button>
    </div>
  );
};

export default Profile;
