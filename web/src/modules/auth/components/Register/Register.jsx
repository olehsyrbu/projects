import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { Dialog } from '@reach/dialog';
import isEmail from 'validator/es/lib/isEmail';
import { PasswordStrength } from '@/modules/auth/components';
import { ERROR_STATUSES } from '@/core/definitions';
import { noop } from '@/core/utils';
import config from '@/core/config';
import showPasswordIcon from '@/images/Shared/ShowPassword.svg';
import hidePasswordIcon from '@/images/Shared/HidePassword.svg';
import CloseIcon from '@/images/Shared/CloseIcon.svg';
import { useOrganization } from '@/modules/organization';
import Logo from '@/modules/app-shell/Logo';
import { useAuthContext } from '@/modules/auth';
import './Register.css';

export function Register({ defaultEmail, onDismiss, handleSwitchToLogin }) {
  const location = useLocation();
  const organization = useOrganization();
  const { register: registerUser } = useAuthContext();
  const { code } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState({ status: false });
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordValidation = useRef(false);
  const hasOneUpperCase = useRef(false);
  const hasOneLowerCase = useRef(false);
  const hasOneNumber = useRef(false);
  const hasEightCharacters = useRef(false);

  const fieldsValid = useRef(false);
  const firstNameErrorMessage = useRef('');
  const lastNameErrorMessage = useRef('');
  const emailErrorMessage = useRef('');
  const confirmEmailErrorMessage = useRef('');
  const passwordErrorMessage = useRef('');

  const [registerAttempted, setRegisterAttempted] = useState(false);

  const errorMessages = {
    firstNameEmpty: 'Please enter your first name',
    lastNameEmpty: 'Please enter your last name',
    emailEmpty: 'Please enter an email address.',
    emailInvalid: 'Please try this email format: xxx@yyy.zzz',
    confirmEmailEmpty: 'Please enter your email to confirm.',
    confirmEmailMismatch: 'Oops! These emails don’t match (please check).',
    confirmEmailPasteAttempt: 'Please type your email to confirm.',
    passwordEmpty: 'Please enter your password.',
    passwordInvalid:
      'Please enter a password with at least 8 characters including a lowercase letter, a uppercase letter, and a number.',
  };

  const register = async () => {
    setSubmitErrorMessage('');
    if (hasError() === true) {
      fieldsValid.current = false;
      setError({ status: true });
      return;
    }

    setRegisterAttempted(true);

    try {
      let params = new URLSearchParams(location.search);

      await registerUser({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        invitation_code: code || params.get('invite'),
      });
    } catch (error) {
      setRegisterAttempted(false);

      const wasAlreadyRegistered = error?.response?.status === ERROR_STATUSES.CONFLICT;

      if (wasAlreadyRegistered) {
        setSubmitErrorMessage(
          'The user with this email already exists, please click "I Have an Account" button and log in instead.',
        );
      } else {
        setSubmitErrorMessage(
          'Could’n connect. There may be a problem with the server. Please try again later.',
        );
      }
    }
  };

  const handlePasswordChange = (e) => {
    let value = e.target.value;
    handlePasswordValidation(value);
    setPassword(value);
  };

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handlePasswordValidation = (password) => {
    const hasNumber = (str) => {
      return /\d/.test(str);
    };
    const hasLowerCase = (str) => {
      return /[a-z]/.test(str);
    };
    const hasUpperCase = (str) => {
      return /[A-Z]/.test(str);
    };
    const hasEightCharactersMin = (str) => {
      return str.length >= 8;
    };

    hasOneUpperCase.current = hasUpperCase(password);
    hasOneLowerCase.current = hasLowerCase(password);
    hasOneNumber.current = hasNumber(password);
    hasEightCharacters.current = hasEightCharactersMin(password);
  };

  const hasError = () => {
    if (firstName.length === 0) {
      firstNameErrorMessage.current = errorMessages.firstNameEmpty;
    } else {
      firstNameErrorMessage.current = '';
    }

    if (lastName.length === 0) {
      lastNameErrorMessage.current = errorMessages.lastNameEmpty;
    } else {
      lastNameErrorMessage.current = '';
    }

    if (email.length === 0) {
      emailErrorMessage.current = errorMessages.emailEmpty;
    } else if (!isEmail(email)) {
      emailErrorMessage.current = errorMessages.emailInvalid;
    } else {
      emailErrorMessage.current = '';
    }

    if (!defaultEmail) {
      if (confirmEmail.length === 0) {
        confirmEmailErrorMessage.current = errorMessages.confirmEmailEmpty;
      } else if (confirmEmail !== email) {
        confirmEmailErrorMessage.current = errorMessages.confirmEmailMismatch;
      } else {
        confirmEmailErrorMessage.current = '';
      }
    }

    if (password.length === 0) {
      passwordErrorMessage.current = errorMessages.passwordEmpty;
    } else if (
      hasOneUpperCase.current === false ||
      hasOneLowerCase.current === false ||
      hasOneNumber.current === false ||
      hasEightCharacters.current === false
    ) {
      passwordErrorMessage.current = errorMessages.passwordInvalid;
    } else {
      passwordErrorMessage.current = '';
    }

    return (
      firstNameErrorMessage.current.length > 0 ||
      lastNameErrorMessage.current.length > 0 ||
      emailErrorMessage.current.length > 0 ||
      confirmEmailErrorMessage.current.length > 0 ||
      passwordErrorMessage.current.length > 0
    );
  };

  const handleShowPasswordValidation = () => {
    setError({ ...error });
    showPasswordValidation.current = true;
  };

  const handleConfirmEmailPaste = (e) => {
    e.preventDefault();
    confirmEmailErrorMessage.current = errorMessages.confirmEmailPasteAttempt;
    setError({ status: true });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // e.preventDefault();
      document.getElementById('registerButton').click();
    }
  };

  let firstNameHasError = error.status === true && firstNameErrorMessage.current.length > 0;

  let lastNameHasError = error.status === true && lastNameErrorMessage.current.length > 0;

  let emailHasError = error.status === true && emailErrorMessage.current.length > 0;

  let confirmEmailHasError = error.status === true && confirmEmailErrorMessage.current.length > 0;

  let passwordHasError = error.status === true && passwordErrorMessage.current.length > 0;

  const firstNameField = (
    <>
      <div id="firstNameField" className={firstNameHasError === true ? 'field has-error' : 'field'}>
        <input
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          type="text"
          placeholder=" "
          name="firstName"
          id="firstName"
          aria-required="true"
          maxLength="255"
          autoComplete="given-name"
          className={firstNameHasError === true ? 'border-error' : ''}
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="firstName" className={firstNameHasError === true ? 'text-error' : ''}>
          First Name
        </label>
      </div>

      {firstNameHasError === true && (
        <div className="error-message">
          <span role="alert">{firstNameErrorMessage.current}</span>
        </div>
      )}
    </>
  );

  const lastNameField = (
    <>
      <div id="lastNameField" className={lastNameHasError === true ? 'field has-error' : 'field'}>
        <input
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          type="text"
          placeholder=" "
          name="lastName"
          id="lastName"
          aria-required="true"
          maxLength="255"
          autoComplete="family-name"
          className={lastNameHasError === true ? 'border-error' : ''}
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="lastName" className={lastNameHasError === true ? 'text-error' : ''}>
          Last Name
        </label>
      </div>

      {lastNameHasError === true && (
        <div className="error-message">
          <span role="alert">{lastNameErrorMessage.current}</span>
        </div>
      )}
    </>
  );

  const emailField = (
    <>
      <div id="emailField" className={emailHasError === true ? 'field has-error' : 'field'}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          readOnly={!!defaultEmail}
          placeholder=" "
          name="email"
          id="email"
          aria-required="true"
          maxLength="255"
          autoComplete="email"
          className={emailHasError === true ? 'border-error' : ''}
          onKeyDown={handleKeyDown}
        />
        <label htmlFor="email" className={emailHasError === true ? 'text-error' : ''}>
          Email
        </label>
      </div>

      {emailHasError === true && (
        <div className="error-message">
          <span role="alert">{emailErrorMessage.current}</span>
        </div>
      )}
    </>
  );

  const confirmEmailField = !defaultEmail && (
    <>
      <div
        id="confirmEmailField"
        className={confirmEmailHasError === true ? 'field has-error' : 'field'}
      >
        <input
          onChange={(e) => setConfirmEmail(e.target.value)}
          value={confirmEmail}
          type="text"
          placeholder=" "
          name="confirmEmail"
          id="confirmEmail"
          aria-required="true"
          maxLength="255"
          autoComplete="off"
          className={confirmEmailHasError === true ? 'border-error' : ''}
          onPaste={handleConfirmEmailPaste}
          onKeyDown={handleKeyDown}
        />

        <label htmlFor="confirmEmail" className={confirmEmailHasError === true ? 'text-error' : ''}>
          Confirm Email
        </label>
      </div>

      {confirmEmailHasError === true && (
        <div className="error-message">
          <span role="alert">{confirmEmailErrorMessage.current}</span>
        </div>
      )}
    </>
  );

  const passwordField = (
    <>
      <div id="passwordField" className={passwordHasError ? 'field has-error' : 'field'}>
        <div>
          <input
            onChange={handlePasswordChange}
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder=" "
            name="password"
            id="password"
            aria-required="true"
            maxLength="255"
            autoComplete="off"
            onFocus={handleShowPasswordValidation}
            className={passwordHasError === true ? 'border-error' : ''}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor="password" className={passwordHasError === true ? 'text-error' : ''}>
            Password
          </label>

          <div
            aria-hidden="true"
            id="showPasswordToggle"
            // aria-label={showPassword ? "hide password" : "show password"}
            onClick={toggleShowPassword}
          >
            <img
              alt="password"
              src={showPassword ? hidePasswordIcon : showPasswordIcon}
              id={showPassword ? 'hidePasswordIcon' : 'showPasswordIcon'}
            />
          </div>
        </div>

        {passwordHasError === true && (
          <div className="error-message">
            <span role="alert">{passwordErrorMessage.current}</span>
          </div>
        )}

        {showPasswordValidation.current ? (
          <div className="mt-4">
            <PasswordStrength password={password} />
          </div>
        ) : null}
      </div>
    </>
  );

  const formButtons = (
    <div id="formButtons">
      <button
        type="button"
        className="mir-button primary"
        id="registerButton"
        onClick={register}
        disabled={registerAttempted}
      >
        {registerAttempted ? 'Creating account' : 'Create account'}
      </button>
      {!defaultEmail && (
        <button
          type="button"
          className="mir-button"
          id="loginButton"
          onClick={handleSwitchToLogin}
          disabled={registerAttempted}
        >
          I Have an Account
        </button>
      )}
    </div>
  );

  const disclaimer = (
    <div id="disclaimer">
      <span>
        By submitting this form you consent to our{' '}
        <a href={config.termsOfUseUrl} target="_blank" rel="noreferrer">
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href={config.privacyPolicyUrl} target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
      </span>
    </div>
  );

  const submitError = submitErrorMessage.length ? (
    <div id="submitErrorMessage">
      <p>{submitErrorMessage}</p>
    </div>
  ) : null;

  return (
    <Dialog as="div" id="registerWindow" onDismiss={onDismiss}>
      <button className="modal-close-button" disabled={registerAttempted} onClick={onDismiss}>
        <img src={CloseIcon} alt="" />
      </button>
      {!organization ? (
        <div className="logo">
          <Logo />
        </div>
      ) : null}
      <p>Create your account</p>

      <form id="registerForm">
        {firstNameField}
        {lastNameField}
        {emailField}
        {confirmEmailField}
        {passwordField}
        {submitError}
        {formButtons}
        {disclaimer}
      </form>
    </Dialog>
  );
}

Register.propTypes = {
  onDismiss: PropTypes.func,
  handleSwitchToLogin: PropTypes.func,
  defaultEmail: PropTypes.string,
};

Register.defaultProps = {
  onDismiss: noop,
  handleSwitchToLogin: noop,
  defaultEmail: '',
};
