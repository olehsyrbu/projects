import { useState } from 'react';
import cn from 'classnames';
import { LoginDialog, ResetPassword } from '@/modules/auth/components';
import PropTypes from 'prop-types';

export function Login({ className }) {
  let [loginDialogOpen, setLoginDialogOpen] = useState(false);
  let [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  const handleResetPassword = () => {
    setLoginDialogOpen(false);
    setResetPasswordDialogOpen(true);
  };

  return (
    <>
      <button className={cn('mir-button', className)} onClick={() => setLoginDialogOpen(true)}>
        Log In
      </button>
      {loginDialogOpen && (
        <LoginDialog
          onDismiss={() => setLoginDialogOpen(false)}
          onSubmit={() => setLoginDialogOpen(false)}
          onResetPasswordOpen={handleResetPassword}
        />
      )}
      {resetPasswordDialogOpen && (
        <ResetPassword
          onDismiss={() => setResetPasswordDialogOpen(false)}
          handleSwitchToLogin={() => {
            setResetPasswordDialogOpen(false);
            setLoginDialogOpen(true);
          }}
        />
      )}
    </>
  );
}

Login.propTypes = {
  className: PropTypes.string,
};
Login.defaultProps = {
  className: 'secondary compact whitespace-nowrap',
};

export default Login;
