import { useState, useRef } from 'react';
import { Dialog } from '@reach/dialog';
import isEmail from 'validator/es/lib/isEmail';
import SuccessIcon from '@/images/Shared/GreenCheck.svg';
import YellowAlertIcon from '@/images/Shared/YellowAlert.svg';
import CloseIcon from '@/images/Shared/CloseIcon.svg';
import './ResetPassword.css';
import password from '@/core/api/PasswordAPI';

export function ResetPassword({ onDismiss, handleSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState({ status: false });
  const [resetWasSent, updateReset] = useState(false);

  const showMessage = useRef(false);
  const submitAttempted = useRef(false);
  const error = useRef(false);
  const success = useRef(false);
  const btn = useRef();

  const handleEmailChange = (e) => {
    submitAttempted.current = false;
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showMessage.current = false;
    submitAttempted.current = true;

    if (!isEmail(email)) {
      error.current = true;
      showMessage.current = true;
      setSendingEmail({ status: false });
      return;
    }

    setSendingEmail({ status: true });
    error.current = false;

    const { err } = await password.forgot({ email });

    if (err) {
      const forgotError = err.message;

      showMessage.current = true;

      if (forgotError) {
        success.current = false;
        setSendingEmail({ status: false });
        return;
      }
    }

    success.current = true;
    setSendingEmail({ status: false });
    updateReset(true);
  };

  const handleMessage = () => {
    if (error.current === true) {
      let errorMessage = 'Please try this email format: xxx@yyy.zzz';
      if (email.length === 0) {
        errorMessage = 'Please enter an email address.';
      }
      return (
        <span className="message error-message" role="alert">
          {errorMessage}
        </span>
      );
    }
    if (showMessage.current === true) {
      if (success.current === false) {
        return emailNotFoundMessage;
      }

      // if(emailSendFailed.current === true) {
      // 	return failureMessage;
      // }

      return successMessage;
    }

    return <></>;
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && submitAttempted.current === true) {
      e.preventDefault();
    }
  };

  const handleButton = () => {
    return resetWasSent ? backToLoginButton : submitButton;
  };

  const submitButton = (
    <button
      ref={btn}
      onClick={handleSubmit}
      type="submit"
      className="mir-button primary reset-password-button"
      id="submitButton"
      disabled={sendingEmail.status}
    >
      {sendingEmail.status ? 'Submitting' : 'Submit'}
    </button>
  );

  const backToLoginButton = (
    <button
      onClick={handleSwitchToLogin}
      type="button"
      className="mir-button primary reset-password-button"
      id="backToLoginButton"
    >
      Back to Log In Page
    </button>
  );

  const successMessage = (
    <div className="message submission-message" id="successMessage">
      <img src={SuccessIcon} alt="" />
      <span>We just sent you an email with instructions to reset your password</span>
    </div>
  );

  const emailNotFoundMessage = (
    <div className="message submission-message" id="emailNotFoundMessage">
      <img src={YellowAlertIcon} alt="" />
      <span>This email is not found in the system</span>
    </div>
  );

  const failureMessage = (
    <div className="message submission-message" id="failureMessage">
      <span>Oops! Something went wrong! Try again</span>
    </div>
  );

  const emailSent = <p className="email-sent">{`Your email: ${email}`}</p>;

  const emailField = (
    <>
      <input
        onChange={handleEmailChange}
        value={email}
        type="text"
        placeholder=" "
        name="email"
        id="email"
        className={error.current === true ? 'border-error' : ''}
        aria-required="true"
        maxLength="255"
        autoComplete="email"
        onKeyDown={handleKeyDown}
      />

      <label htmlFor="email" className={error.current === true ? 'text-error' : ''}>
        Email
      </label>
    </>
  );

  const handleFormField = success.current === true ? emailSent : emailField;

  return (
    <Dialog className="ResetPassword" onDismiss={onDismiss}>
      <button className="modal-close-button" disabled={sendingEmail.status} onClick={onDismiss}>
        <img src={CloseIcon} alt="" />
      </button>

      <h1>Reset your password</h1>
      <form>
        <div id="emailField" className="field">
          {handleFormField}
          {handleMessage()}
          {success.current && (
            <div className="message submission-message" id="successMessage">
              <img src={SuccessIcon} alt="" />
              <span>We just sent you an email with instructions to reset your password</span>
            </div>
          )}
        </div>
        <div className="form-button">{handleButton()}</div>
      </form>
    </Dialog>
  );
}
