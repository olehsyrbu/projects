import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import PropTypes from 'prop-types';
import cx from '@/features/group-practice-admin/Page.module.css';

export function DeleteDialog({ state, onSubmit, onDismiss }) {
  const DialogComponent = state?.isOpenDelete
    ? DeleteProfileDialog
    : state?.isOpenRemove
    ? RemoveProfileDialog
    : null;

  return DialogComponent ? (
    <DialogComponent {...state} onSubmit={onSubmit} onDismiss={onDismiss} />
  ) : null;
}

DeleteDialog.propTypes = {
  state: PropTypes.shape({
    invitationProfile: PropTypes.oneOfType([PropTypes.oneOfType([null]), PropTypes.object]),
    name: PropTypes.string,
    count: PropTypes.string,
    isOpenDelete: PropTypes.bool,
    isOpenRemove: PropTypes.bool,
    isOpenGenerateInvites: PropTypes.bool,
  }),
  onSubmit: PropTypes.func,
  onDismiss: PropTypes.func,
};

function DeleteProfileDialog({ onDismiss, onSubmit, count, name }) {
  const isManyProfiles = count > 1;
  const title = isManyProfiles ? 'Delete providers' : 'Delete provider';

  return (
    <Dialog isOpen onDismiss={onDismiss} width={550}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className={cx.content}>
          {isManyProfiles ? (
            <p className="pb-6">
              You have selected to delete {` `}
              <span className="font-bold">{count}</span> providers.
            </p>
          ) : (
            <p className="pb-6">
              You have selected to delete this provider: {` `}
              <span className="font-bold">{name}</span> .
            </p>
          )}
          <p>
            If you confirm, all data associated with this provider will be deleted permanently. The
            data cannot be restored in the future.
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={onSubmit}>
          Delete
        </button>
        <button className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}
DeleteProfileDialog.propTypes = DeleteDialog.propTypes;

function RemoveProfileDialog({ onDismiss, onSubmit, count, name }) {
  const isManyProfiles = count > 1;
  const title = isManyProfiles ? 'Remove resources' : 'Remove resource';

  return (
    <Dialog isOpen onDismiss={onDismiss} width={550}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className={cx.content}>
          {isManyProfiles ? (
            <p className="pb-6">
              You have selected to remove {` `}
              <span className="font-bold">{count}</span> providers.
            </p>
          ) : (
            <p className="pb-6">
              You have selected to remove: {` `}
              <span className="font-bold">{name}</span>.
            </p>
          )}
          <p>
            Any provider removed will no longer appear in the search results for members. The data
            on these providers will not be lost, and you can re-activate them anytime.
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button" onClick={onSubmit}>
          Yes
        </button>
        <button className="mir-button primary" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

RemoveProfileDialog.propTypes = DeleteDialog.propTypes;
