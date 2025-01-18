import { Modal, Dialog as AriaDialog } from 'react-aria-components';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import PropTypes from 'prop-types';
import cx from './Dialog.module.css';

export function Dialog({
  isOpen,
  onDismiss,
  children,
  width,
  maxHeight,
  showButton = true,
  contentClassName,
}) {
  return (
    <Modal
      data-testid="dialog-overlay"
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70"
      isOpen={isOpen}
      onOpenChange={(openState) => {
        if (!openState && onDismiss) {
          onDismiss();
        }
      }}
    >
      <AriaDialog
        data-testid="dialog"
        role="alertdialog"
        className={`${cx.dialog} ${contentClassName}`}
        style={{ width, maxHeight }}
      >
        {({ close }) => (
          <>
            {showButton && (
              <button
                className={cx.closeButton}
                aria-label="Close dialog"
                onClick={() => {
                  close();
                  if (onDismiss) {
                    onDismiss();
                  }
                }}
              >
                <Dismiss />
              </button>
            )}
            {typeof children === 'function'
              ? children({
                  close: () => {
                    close();
                    if (onDismiss) {
                      onDismiss();
                    }
                  },
                })
              : children}
          </>
        )}
      </AriaDialog>
    </Modal>
  );
}

Dialog.propTypes = {
  showButton: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  contentClassName: PropTypes.string,
};
