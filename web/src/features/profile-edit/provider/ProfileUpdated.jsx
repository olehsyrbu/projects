import { useState } from 'react';
import PropTypes from 'prop-types';
import { actualizeProvider } from '@/core/api/ProviderAPI';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import mixpanel from '@/core/mixpanel';

export function ProfileUpdated({ provider }) {
  const [isShowProfileUpdatedDialog, setIsShowProfileUpdatedDialog] = useState(false);

  function hideDialog() {
    setIsShowProfileUpdatedDialog(false);
  }

  function showDialog() {
    setIsShowProfileUpdatedDialog(true);
  }

  function onSuccess() {
    mixpanel.track('Update Provider', {
      availability: provider.availability,
      slug: provider.slug,
      status: provider.status,
      mode: provider.mode,
    });
  }

  return (
    <div className="mt-12 flex justify-center">
      <button onClick={showDialog} className="mir-button primary">
        Profile Updated
      </button>
      {isShowProfileUpdatedDialog && (
        <ProfileUpdatedDialog id={provider.id} onSuccess={onSuccess} onDismiss={hideDialog} />
      )}
    </div>
  );
}

ProfileUpdated.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    mode: PropTypes.string,
    status: PropTypes.string,
  }),
};

function ProfileUpdatedDialog({ onDismiss, id, onSuccess }) {
  const [isShowAction, setIsShowAction] = useState(true);
  const [text, setText] = useState(
    'By clicking this button, you are confirming that your profile is up to date. Are you sure?',
  );

  async function handleSubmit() {
    try {
      await actualizeProvider(id);
      onSuccess();
      setText('You have successfully updated your profile!');
    } catch {
      setText('');
    }
    setIsShowAction(false);
  }

  return (
    <Dialog onDismiss={onDismiss} isOpen width={500}>
      <DialogTitle>Profile updated</DialogTitle>
      <DialogContent>
        <p>{text}</p>
      </DialogContent>
      {isShowAction && (
        <DialogActions>
          <button type="submit" className="mir-button primary" onClick={handleSubmit}>
            I confirm
          </button>
          <button className="mir-button" onClick={onDismiss}>
            Cancel
          </button>
        </DialogActions>
      )}
    </Dialog>
  );
}

ProfileUpdatedDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  id: PropTypes.string,
};
