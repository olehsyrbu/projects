import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { TextField } from '@/core/components/TextField';
import { useAuthContext } from '../AuthUser';
import { useFlag } from '@/core/feature-split';
import Logo from '@/modules/app-shell/Logo';
import { SSODialog } from './SSODialog';

export function LoginDialog({
  registrationAvailable,
  displayCustomerMessage,
  onRegisterOpen,
  onResetPasswordOpen,
  onDismiss,
  onSubmit,
}) {
  let auth = useAuthContext();
  let ssoEnabled = useFlag('single-sign-on');
  let [pending, setPending] = useState(false);
  let [ssoDisplayed, setSsoDisplayed] = useState(false);
  let [error, setError] = useState(null);

  async function submitForm(event) {
    event.preventDefault();

    let { email, password } = event.target.elements;

    setPending(true);

    try {
      await auth.logIn(email.value, password.value);
      onSubmit();
    } catch (error) {
      setError(error);
      setPending(false);
    }
  }

  if (ssoDisplayed) {
    return <SSODialog onLoginOpen={() => setSsoDisplayed(false)} onDismiss={onDismiss} />;
  }

  return (
    <Dialog
      isOpen
      onDismiss={onDismiss}
      aria-label="Login Dialog"
      className="relative m-0 box-border flex h-full w-full flex-col overflow-auto px-4 pb-[env(safe-area-inset-bottom)] pt-0 md:m-auto md:mt-[10vh] md:h-auto md:w-[500px] md:rounded-xl md:px-16 md:pb-9 md:pt-12"
    >
      <button
        onClick={onDismiss}
        className="absolute left-4 top-5 z-10 m-0 cursor-pointer border-none bg-transparent p-0 text-p-100 md:left-[initial] md:right-3 md:top-3"
      >
        <span className="sr-only">Dismiss</span>
        <Dismiss />
      </button>
      <div className="absolute left-0 right-0 top-0 py-5 md:hidden">
        <Logo />
      </div>

      <form className="mt-32 flex flex-1 flex-col space-y-6 md:mt-0" onSubmit={submitForm}>
        <h2 className="text-center text-2xl font-bold leading-normal md:font-serif">
          Glad to see you again
        </h2>

        <TextField type="email" name="email" label="Email" required />
        <TextField type="password" name="password" label="Password" required />

        <button
          type="button"
          className="m-0 cursor-pointer self-center border-none bg-transparent p-0 text-sm leading-normal text-p-100"
          onClick={onResetPasswordOpen}
        >
          Forgot your password?
        </button>

        <div className="!mt-auto" />

        {error && (
          <p className="text-center text-sm leading-normal text-error-1">
            Email or password you entered is incorrect
          </p>
        )}

        <div className="flex space-x-3">
          <button type="submit" className="mir-button primary flex-1 !px-2" disabled={pending}>
            Log In
          </button>
          {registrationAvailable && (
            <button type="button" className="mir-button flex-1 !px-2" onClick={onRegisterOpen}>
              Create account
            </button>
          )}
        </div>
        {ssoEnabled && (
          <p className="text-center text-sm leading-normal">
            or{' '}
            <button
              type="button"
              className="m-0 cursor-pointer border-none bg-transparent p-0 text-sm leading-normal text-p-100"
              onClick={() => setSsoDisplayed(true)}
            >
              Log in with your organization
            </button>
          </p>
        )}
        {displayCustomerMessage && (
          <div className="-mx-4 bg-p-10 px-10 py-2 md:-mx-16 md:px-7">
            <p className="text-center text-sm leading-normal">
              If you are using MiResource to search for care, you don’t need to log in
            </p>
          </div>
        )}
      </form>
    </Dialog>
  );
}

LoginDialog.propTypes = {
  registrationAvailable: PropTypes.bool,
  displayCustomerMessage: PropTypes.bool,
  onRegisterOpen: PropTypes.func,
  onResetPasswordOpen: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

LoginDialog.defaultProps = {
  registrationAvailable: false,
  displayCustomerMessage: true,
  onRegisterOpen: () => {},
  onSubmit: () => {},
};
