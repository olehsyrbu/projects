import { useEffect, useRef, useState } from 'react';
import './ResetPassword.css';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { PasswordStrength } from '@/modules/auth/components';
import password from '@/core/api/PasswordAPI';
import showPasswordIcon from '@/images/Shared/ShowPassword.svg';
import hidePasswordIcon from '@/images/Shared/HidePassword.svg';
import GreenCheck from '@/images/Shared/GreenCheck.svg';
import { useAuthContext } from '@/modules/auth';

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut } = useAuthContext();
  const params = new URLSearchParams(location.search);
  const code = params.get('reset');

  useEffect(() => {
    if (code && localStorage.getItem('authToken')) {
      logOut();
    }
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState({ status: false });

  const hasOneUpperCase = useRef(false);
  const hasOneLowerCase = useRef(false);
  const hasOneNumber = useRef(false);
  const hasEightCharacters = useRef(false);

  const newPasswordError = useRef('');
  const confirmPasswordError = useRef('');
  const showValidation = useRef(false);
  const showSuccess = useRef(false);
  const showFailure = useRef(false);

  const [resetAttempted, setResetAttempted] = useState(false);

  if (!code) {
    return <Navigate to="/" replace />;
  }

  const errorMessages = {
    newPasswordEmpty: 'Please enter your new password',
    newPasswordInvalid:
      'Please enter a password with at least 8 characters including a lowercase letter, a uppercase letter, and a number.',
    confirmPasswordEmpty: 'Please enter your password to confirm',
    confirmPasswordMismatch: 'Passwords do not match',
  };

  const handleNewPasswordChange = (e) => {
    let value = e.target.value;
    handleNewPasswordValidation(value);
    setNewPassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    let value = e.target.value;
    setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showSuccess.current = false;
    showFailure.current = false;
    handleNewPasswordValidation(newPassword);
    handleError();

    if (newPasswordError.current.length > 0 || confirmPasswordError.current.length > 0) {
      setError({ status: true });
      return;
    }

    setResetAttempted(true);
    showValidation.current = false;
    setError({ status: false });

    try {
      let userData = await password.reset({
        password: newPassword,
        hash: code,
      });

      showSuccess.current = true;
      setNewPassword('');
      setConfirmPassword('');
      setUser(userData);
    } catch (error) {
      showFailure.current = true;
      setError({ ...error });
    }

    setResetAttempted(false);
  };

  const backToLoginPage = () => {
    if (user.role === 'referral_coordinator') {
      navigate('/referral-coordinator', { replace: true });
    } else {
      navigate('/provider', { replace: true });
    }
  };

  const handleNewPasswordValidation = (password) => {
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

    hasOneUpperCase.current = hasUpperCase(password) ? true : false;
    hasOneLowerCase.current = hasLowerCase(password) ? true : false;
    hasOneNumber.current = hasNumber(password) ? true : false;
    hasEightCharacters.current = hasEightCharactersMin(password) ? true : false;
  };

  const handleError = () => {
    if (newPassword.length === 0) {
      newPasswordError.current = errorMessages.newPasswordEmpty;
    } else if (
      hasOneUpperCase.current === false ||
      hasOneLowerCase.current === false ||
      hasOneNumber.current === false ||
      hasEightCharacters.current === false
    ) {
      newPasswordError.current = errorMessages.newPasswordInvalid;
    } else {
      newPasswordError.current = '';
    }

    if (confirmPassword.length === 0) {
      confirmPasswordError.current = errorMessages.confirmPasswordEmpty;
    } else if (confirmPassword !== newPassword) {
      confirmPasswordError.current = errorMessages.confirmPasswordMismatch;
    } else {
      confirmPasswordError.current = '';
    }
  };

  let newPasswordFieldClasses = () => {
    let classes = 'field';

    if (showValidation.current === true) {
      classes += ' focused';
    }
    if (error.status === true) {
      classes += ' has-error';
    }
    return classes;
  };

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleShowValidation = () => {
    showValidation.current = true;
    setError({ ...error });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      document.getElementById('resetPasswordButton').click();
    }
  };

  const successMessage =
    showSuccess.current === true ? (
      <div className="message submission-message" id="passwordResetSuccess">
        <img src={GreenCheck} alt="" />
        <span>Password has been reset</span>
      </div>
    ) : (
      <></>
    );

  const failureMessage =
    showFailure.current === true ? (
      <div className="message submission-message" id="failureMessage">
        <span>Oops! Something went wrong! Try again</span>
      </div>
    ) : (
      <></>
    );

  const newPasswordField =
    showSuccess.current === false ? (
      <>
        <div id="newPasswordField" className={newPasswordFieldClasses()}>
          <div>
            <input
              onChange={handleNewPasswordChange}
              value={newPassword}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              name="newPassword"
              id="newPassword"
              className={
                error.status === true && newPasswordError.current.length > 0 ? 'border-error' : ''
              }
              aria-required="true"
              maxLength="255"
              autoComplete="off"
              onFocus={handleShowValidation}
              onKeyDown={handleKeyDown}
            />
            <label
              htmlFor="newPassword"
              className={
                error.status === true && newPasswordError.current.length > 0 ? 'text-error' : ''
              }
            >
              New Password
            </label>

            {/* eslint-disable-next-line */}
            <span id="showPasswordToggle" onClick={toggleShowPassword}>
              <img
                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                id={showPassword ? 'hidePasswordIcon' : 'showPasswordIcon'}
                alt=""
              />
            </span>
          </div>

          {error.status === true && newPasswordError.current.length > 0 && (
            <span id="newPasswordError" className="message error-message" role="alert">
              {newPasswordError.current}
            </span>
          )}
          {showValidation.current === true && (
            <div className="my-4">
              <PasswordStrength password={newPassword} />
            </div>
          )}
        </div>
      </>
    ) : (
      <></>
    );

  const confirmPasswordField =
    showSuccess.current === false ? (
      <>
        <div id="confirmPasswordField" className="field">
          <input
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            type={showPassword ? 'text' : 'password'}
            placeholder=" "
            name="confirmPassword"
            id="confirmPassword"
            className={
              error.status === true && confirmPasswordError.current.length > 0 ? 'border-error' : ''
            }
            aria-required="true"
            maxLength="255"
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />
          <label
            htmlFor="confirmPassword"
            className={
              error.status === true && confirmPasswordError.current.length > 0 ? 'text-error' : ''
            }
          >
            Confirm Password
          </label>

          {error.status === true && confirmPasswordError.current.length > 0 && (
            <span className="message error-message" role="alert">
              {confirmPasswordError.current}
            </span>
          )}
          {failureMessage}
        </div>
      </>
    ) : (
      <></>
    );

  const formButton =
    showSuccess.current === false ? (
      <div className="form-button">
        <button
          onClick={handleSubmit}
          type="button"
          className="reset-password-button mir-button primary"
          id="resetPasswordButton"
          disabled={resetAttempted}
        >
          {resetAttempted ? 'Resetting password' : 'Reset password'}
        </button>
      </div>
    ) : (
      <div className="form-button">
        <button
          onClick={backToLoginPage}
          type="button"
          className="reset-password-button mir-button primary"
          id="backToLoginButton"
        >
          Back to Log In Page
        </button>
      </div>
    );

  return (
    <div className="reset-password-form-container">
      <div className="reset-password-window">
        <h1>Reset your password</h1>
        <form>
          {newPasswordField}
          {confirmPasswordField}
          {successMessage}
          {formButton}
        </form>
      </div>
    </div>
  );
}
