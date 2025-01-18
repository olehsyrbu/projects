import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import isEmail from 'validator/es/lib/isEmail';
import password from '@/core/api/PasswordAPI';
import SuccessIcon from '@/images/Shared/GreenCheck.svg';
import YellowAlertIcon from '@/images/Shared/YellowAlert.svg';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';
import './ResetPassword.css';

export default function ResetPassword() {
  const { handleSubmit, register, getValues } = useForm();

  const [sendingEmail, setSendingEmail] = useState({ status: false });
  const [resetWasSent, updateReset] = useState(false);

  const email = getValues('email');
  const showMessage = useRef(false);
  const submitAttempted = useRef(false);
  const error = useRef(false);
  const success = useRef(false);
  const btn = useRef();

  const handleButtonSubmit = async ({ email }) => {
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

      return successMessage;
    }

    return <></>;
  };

  const handleButton = () => {
    return resetWasSent ? backToLoginButton : submitButton;
  };

  const submitButton = (
    <button
      ref={btn}
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
      // onClick={handleSwitchToLogin}
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

  const emailSent = <p className="email-sent">{`Your email: ${email}`}</p>;

  const emailField = (
    <InputText label="Email" className="email" invalid={error.current} {...register('email')} />
  );

  const handleFormField = success.current === true ? emailSent : emailField;

  return (
    <div className="reset-password">
      <p className="title">Reset your password</p>
      <form onSubmit={handleSubmit(handleButtonSubmit)}>
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
    </div>
  );
}
