import { useAuthContext } from '@/auth';
import DatePill from '@/components/DatePill';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { getGreeting } from '@/utils';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { signOut, submitting } = useAuthContext();

  return (
    <div className="flex grow flex-col gap-4 ">
      <Header title={getGreeting()}>
        <DatePill />
      </Header>

      <Button
        variant="secondary"
        onClick={signOut}
        className="mb-4 mt-auto"
        disabled={submitting}
      >
        {submitting && <Loader2 className="animate-spin" />}
        {submitting ? 'Signing out' : 'Sign out'}
      </Button>
    </div>
  );
};

export default Profile;
