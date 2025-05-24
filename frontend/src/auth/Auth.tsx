import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getRedirectUrl } from './utils';
import { useAuthContext } from './AuthContext';

const AuthPage: React.FC = () => {
  const { client } = useAuthContext();

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome</h1>
        <p className="text-gray-600">
          Sign in to your account or create a new one
        </p>
      </div>

      <Auth
        supabaseClient={client}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={getRedirectUrl()}
        view="sign_in" // This allows toggling between sign_in and sign_up
        showLinks={true} // Shows "Don't have an account? Sign up" links
      />
    </div>
  );
};

export default AuthPage;
