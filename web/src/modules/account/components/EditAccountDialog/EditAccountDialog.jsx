import { useState } from 'react';
import cn from 'classnames';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import isEmail from 'validator/es/lib/isEmail';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { InputField } from './InputField';
import { DeleteAccountDialog } from '../DeleteAccountDialog';
import password from '@/core/api/PasswordAPI';
import { useAuthContext } from '@/modules/auth';
import hidePasswordIcon from '@/images/Shared/HidePassword.svg';
import showPasswordIcon from '@/images/Shared/ShowPassword.svg';
import { EditNotifications } from './EditNotifications';
import { useFlag } from '@/core/feature-split';
import { getIsRoleProvider } from '@/features/onboarding/utils';
import './EditAccountDialog.css';

export function EditAccountDialog({ isOpen, onDismiss }) {
  const { user, updateUser } = useAuthContext();
  const notifications = useFlag('notifications-email');

  const isShowNotifications = getIsRoleProvider(user?.role) && notifications;

  let form = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    },
    shouldUnregister: true,
    reValidateMode: 'onSubmit',
  });

  let [deleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [editNotificationsOpen, setEditNotificationsOpen] = useState(false);

  async function submitForm(values) {
    let { oldPassword, newPassword, ...profileFields } = values;
    await updateUser(user.id, profileFields);

    if (newPassword) {
      let { err } = await password.change(user.id, oldPassword, newPassword);
      if (err) {
        form.setError('oldPassword', {
          type: 'passwordMismatch',
          message: 'Invalid password',
        });
        return;
      }
    }
    onDismiss();
  }

  if (deleteAccountVisible) {
    return <DeleteAccountDialog isOpen onDismiss={() => setDeleteAccountVisible(false)} />;
  }

  return (
    <DialogOverlay isOpen={isOpen} onDismiss={onDismiss} className="EditAccountDialog">
      <DialogContent
        aria-labelledby="editAccountHeader"
        className={cn({ submitting: form.formState.isSubmitting })}
      >
        <button aria-label="Close" className="close-button" onClick={onDismiss}>
          <Dismiss />
        </button>
        {editNotificationsOpen ? (
          <EditNotifications onBackEdit={() => setEditNotificationsOpen(false)} />
        ) : (
          <>
            <h2 id="editAccountHeader">Edit Account</h2>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(submitForm)}>
                <NameSection />
                <EmailSection initialValue={user?.email} />
                <PasswordSection />
                {isShowNotifications && (
                  <NotificationsSection onChange={setEditNotificationsOpen} />
                )}
                <DeleteAccountSection onClick={() => setDeleteAccountVisible(true)} />
                <div className="form-actions">
                  <button type="submit" className="mir-button primary">
                    Confirm
                  </button>
                  <button className="mir-button" onClick={onDismiss}>
                    Cancel
                  </button>
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </DialogContent>
    </DialogOverlay>
  );
}

function NameSection({ register }) {
  return (
    <div className="field-section editable">
      <span className="legend">Name</span>
      <InputField name="firstName" label="First name" rules={{ required: true }} />
      <InputField name="lastName" label="Last name" rules={{ required: true }} />
    </div>
  );
}

function EmailSection({ initialValue }) {
  let form = useFormContext();
  let [editable, setEditable] = useState(false);

  function matchesEmail(value) {
    return value === form.getValues('email');
  }

  return editable ? (
    <div className="field-section editable">
      <span className="legend">Email</span>
      <InputField
        type="email"
        name="email"
        label="Your email"
        autoComplete="email"
        rules={{
          required: true,
          validate: { emailFormat: isEmail },
        }}
      />
      <InputField
        type="email"
        label="Confirm email"
        name="emailConfirm"
        defaultValue=""
        autoComplete="off"
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
        rules={{
          required: true,
          validate: {
            emailFormat: isEmail,
            emailConfirm: matchesEmail,
          },
        }}
      />
      <button onClick={() => setEditable(false)}>Discard email changes</button>
    </div>
  ) : (
    <div className="field-section">
      <button style={{ float: 'right' }} onClick={() => setEditable(true)}>
        Change
      </button>
      <span className="legend">Email</span>
      <span>
        Your email is: <strong>{initialValue}</strong>
      </span>
    </div>
  );
}

function PasswordIcon({ showPassword, handleChangeViewPassword }) {
  const toggleShowPassword = (e) => {
    e.preventDefault();
    handleChangeViewPassword(!showPassword);
  };

  return (
    <button className="show-password-toggle" onClick={toggleShowPassword}>
      <img
        src={showPassword ? hidePasswordIcon : showPasswordIcon}
        id={showPassword ? 'hidePasswordIcon' : 'showPasswordIcon'}
        alt=""
      />
    </button>
  );
}

function PasswordSection() {
  let form = useFormContext();
  let [editable, setEditable] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function matchesNewPassword(value) {
    return value === form.getValues('newPassword');
  }

  function passwordIsStrong(value) {
    return isStrongPassword(value, { minSymbols: 0 });
  }

  return editable ? (
    <div className="field-section editable">
      <span className="legend">Password</span>
      <InputField
        type={showOldPassword ? 'text' : 'password'}
        label="Old password"
        name="oldPassword"
        defaultValue=""
        autoComplete="current-password"
        rules={{ required: true }}
      >
        <PasswordIcon
          showPassword={showOldPassword}
          handleChangeViewPassword={setShowOldPassword}
        />
      </InputField>
      <InputField
        type={showNewPassword ? 'text' : 'password'}
        label="New password"
        name="newPassword"
        defaultValue=""
        autoComplete="new-password"
        rules={{
          required: true,
          validate: {
            passwordStrength: passwordIsStrong,
          },
        }}
      >
        <PasswordIcon
          showPassword={showNewPassword}
          handleChangeViewPassword={setShowNewPassword}
        />
      </InputField>
      <InputField
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm new password"
        name="passwordConfirm"
        defaultValue=""
        autoComplete="off"
        onPaste={(event) => event.preventDefault()}
        onDrop={(event) => event.preventDefault()}
        rules={{
          required: true,
          validate: {
            passwordConfirm: matchesNewPassword,
          },
        }}
      >
        <PasswordIcon
          showPassword={showConfirmPassword}
          handleChangeViewPassword={setShowConfirmPassword}
        />
      </InputField>
      <button onClick={() => setEditable(false)}>Discard password changes</button>
    </div>
  ) : (
    <div className="field-section">
      <button style={{ float: 'right' }} onClick={() => setEditable(true)}>
        Change
      </button>
      <span className="legend">Password</span>
    </div>
  );
}

function DeleteAccountSection({ onClick }) {
  return (
    <div className="field-section">
      <button type="button" style={{ marginBottom: '0.75rem' }} onClick={onClick}>
        Delete My Account
      </button>
      <p>
        Please note, by permanently deleting your account, you will lose access to all of your
        resources.
      </p>
    </div>
  );
}

function NotificationsSection({ onChange }) {
  return (
    <div className="field-section">
      <button style={{ float: 'right' }} onClick={() => onChange(true)}>
        Change
      </button>
      <span className="legend">Notifications</span>
    </div>
  );
}
