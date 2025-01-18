import PropTypes from 'prop-types';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { actualizeProvider } from '@/core/api/ProviderAPI';
import { logger } from '@/core/logger';
import { useNavigate } from 'react-router-dom';

export function DeactivateNotice({ id, organization, onActivate }) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [activated, setActivate] = useState(false);

  async function handleActivateProfile() {
    try {
      await actualizeProvider(id);
      setActivate(true);
    } catch (e) {
      logger.error('error in actualizeProvider');
    }
  }

  return (
    <div className="flex flex-col items-center rounded-lg bg-[#FFEFBE] px-6 py-3 max-md:mb-4 md:mt-3  md:flex-row">
      <div>
        <span className="text-base font-bold text-heading">
          Your profile has been removed from {organization} searches because you have not updated
          your profile in 90 days.
        </span>
        <span className="pl-1 text-base">
          To appear in {organization} searches, please update your profile.
        </span>
      </div>
      <button
        onClick={() => setShowDialog(true)}
        className="mir-button primary mt-4 w-full md:ml-6 md:mt-0 md:!w-64"
      >
        Update profile
      </button>
      {showDialog && (
        <DialogUpdateProfile
          organization={organization}
          activated={activated}
          onActivate={handleActivateProfile}
          onDismiss={() => (activated ? onActivate() : setShowDialog(false))}
          onEdit={() => navigate(`/provider/resources/edit/${id}`)}
        />
      )}
    </div>
  );
}

DeactivateNotice.propTypes = {
  organization: PropTypes.string,
  id: PropTypes.string,
  onActivate: PropTypes.func,
};

DeactivateNotice.defaultProps = {
  organization: '',
  id: '',
  onActivate: () => {},
};

function DialogUpdateProfile({ activated, onEdit, onActivate, onDismiss, organization }) {
  const title = activated ? 'Profile updated' : 'Update profile';
  const content = activated
    ? `You have successfully updated your profile and will appear in ${organization} searches!`
    : 'You can either confirm your profile is up-to-date or continue to edit your profile to\n' +
      'reactivate in search.';
  const actions = activated ? (
    <button className="mir-button" onClick={onDismiss}>
      Close
    </button>
  ) : (
    <>
      <button type="submit" className="mir-button primary" onClick={onActivate}>
        Profile is updated
      </button>
      <button className="mir-button" onClick={onEdit}>
        Edit profile
      </button>
    </>
  );

  return (
    <Dialog onDismiss={onDismiss} isOpen width={500}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}

DialogUpdateProfile.propTypes = {
  onDismiss: PropTypes.func,
  onActivate: PropTypes.func,
  onEdit: PropTypes.func,
  activated: PropTypes.bool,
  organization: PropTypes.string,
};

DialogUpdateProfile.defaultProps = {
  onDismiss: () => {},
  onActivate: () => {},
  onEdit: () => {},
  id: '',
  organization: '',
};
