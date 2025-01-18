import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useInvitationValidity } from '@/core/api/InvitationQueries';
import {
  LoginDialog,
  Register as RegisterDialog,
  ResetPassword as ResetPasswordDialog,
} from '@/modules/auth/components';

export function AuthActions() {
  let { code } = useParams();
  let invite = useInvitationValidity({ code }) || {};

  let [dialog, setDialog] = useState(null);

  return (
    <>
      <div className="space-y-9 md:space-y-0">
        {invite?.valid ? (
          <button
            className="mir-button primary w-full rounded-full text-xl md:mr-7 md:w-60 md:text-base"
            onClick={() => setDialog('register')}
            aria-label="Create account"
          >
            Create account
          </button>
        ) : null}
        <button
          className="mir-button w-full rounded-full text-xl font-bold  text-p-100 md:w-64 md:text-base md:font-medium"
          onClick={() => setDialog('login')}
          aria-label="Login"
        >
          I already have an account
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
