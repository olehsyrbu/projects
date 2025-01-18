import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@/core/components/Select';
import { getUserEmailsOptions } from './utils/getUserEmailsOptions';
import { useMatchMedia } from '@/core/hooks/useMatchMedia';
import { AdditionalEmailSection } from './AdditionalEmailSection';
import { Option } from './Options';
import '../EditAccountDialog.css';
import { useAuthContext } from '@/modules/auth';

export function EditNotifications({ onBackEdit }) {
  let { user, updateUser } = useAuthContext();
  const [email, setEmail] = useState(null);
  const [availableEmails, setAvailableEmails] = useState([]);
  let isMobile = useMatchMedia('(max-width: 767px)');

  useEffect(() => {
    const emailsList = getUserEmailsOptions(user);
    setAvailableEmails(emailsList);
    setEmail(emailsList[0]);
  }, [user]);

  async function saveUserChanges(notificationEmail) {
    await updateUser(user.id, { notificationEmail });
  }

  async function handleSaveClick() {
    await saveUserChanges(email.value);
    onBackEdit();
  }

  return (
    <>
      <h2>Notifications</h2>
      <div className="field-section !pb-0">
        <p className="pb-6">Review and choose who gets your email notifications.</p>
        <span className="legend pb-1 text-heading">Currently your email notifications go to:</span>
        <Select
          label="Email"
          options={availableEmails}
          value={email}
          onChange={(value) => setEmail(value)}
          components={{ Option }}
        />
      </div>
      <AdditionalEmailSection availableEmails={availableEmails} saveUserChanges={saveUserChanges} />
      <p className="mt-6 text-sm">
        If you have an admin and want them to register with MiResource to have edit access for your
        profile, please message <a href="mailto:support@miresource.com">support@miresource.com</a>{' '}
        and we will invite your designated admin to create an account.
      </p>
      <div className="form-actions mt-6">
        <button className="mir-button primary" onClick={handleSaveClick}>
          Save changes
        </button>
        <button className="mir-button" onClick={onBackEdit}>
          {`Back to edit ${isMobile ? '' : 'account'}`}
        </button>
      </div>
    </>
  );
}

EditNotifications.propTypes = {
  onBackEdit: PropTypes.func,
};
