import { Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInvitationValidity } from '@/core/api/InvitationQueries';
import {
  LoginDialog,
  Register as RegisterDialog,
  ResetPassword as ResetPasswordDialog,
} from '@/modules/auth/components';

export function AuthActions() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AuthActionsUI />
    </Suspense>
  );
}

function AuthActionsUI() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let invite = useInvitationValidity({
    code: params.get('invite'),
  });

  let [dialog, setDialog] = useState(null);

  return (
    <>
      <div className="actions">
        {invite.valid ? (
          <button className="mir-button large primary" onClick={() => setDialog('register')}>
            Create account
          </button>
        ) : null}
        <button className="mir-button large" onClick={() => setDialog('login')}>
          I have an account
        </button>
      </div>

      {dialog === 'register' ? (
        <RegisterDialog
          defaultEmail={invite.params?.email}
          onDismiss={() => setDialog(null)}
          handleSwitchToLogin={() => setDialog('login')}
        />
      ) : null}
      {dialog === 'login' ? (
        <LoginDialog
          displayCustomerMessage={false}
          registrationAvailable={invite.valid}
          onRegisterOpen={() => setDialog('register')}
          onResetPasswordOpen={() => setDialog('reset')}
          onDismiss={() => setDialog(null)}
        />
      ) : null}
      {dialog === 'reset' ? (
        <ResetPasswordDialog
          onDismiss={() => setDialog(null)}
          handleSwitchToLogin={() => setDialog('login')}
        />
      ) : null}
    </>
  );
}

function Skeleton() {
  return (
    <div className="actions">
      <button className="mir-button large primary skeleton">{'x'.repeat(14)}</button>
      <button className="mir-button large skeleton">{'x'.repeat(17)}</button>
    </div>
  );
}
