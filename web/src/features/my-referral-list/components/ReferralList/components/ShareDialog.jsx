import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/core/components';

export function ShareDialog({ link, onClose }) {
  const handleCopyText = async () => {
    await navigator.clipboard.writeText(link);
    onClose();
  };

  return (
    <Dialog isOpen onDismiss={onClose} width={536}>
      <DialogTitle>Share referral list</DialogTitle>
      <DialogContent>
        <p className="mb-3">You can copy the link from the block below</p>
        <div className="rounded-lg bg-p-10 px-4 py-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-p-100"
          >
            {link}
          </a>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={handleCopyText}>
          Copy link and close
        </button>
        <button className="mir-button" onClick={onClose}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

ShareDialog.propTypes = {
  link: PropTypes.string,
  onClose: PropTypes.func,
};
