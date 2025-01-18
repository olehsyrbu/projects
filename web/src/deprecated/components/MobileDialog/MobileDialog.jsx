import { useEffect } from 'react';
import { ModalOverlay, Modal } from 'react-aria-components';
import './MobileDialog.css';

export default function MobileDialog({
  children,
  isOpen,
  contentClassName,
  'aria-label': ariaLabel,
  ...props
}) {
  // This effect fixes modal after iOS tries to scroll the body when input gets focus
  useEffect(() => {
    if (isOpen) {
      let scrollPosition = window.scrollY;
      window.scrollTo(0, 0);
      return () => window.scrollTo(0, scrollPosition);
    }
  }, [isOpen]);

  return (
    <ModalOverlay
      className="mir-mobile-dialog fixed inset-0 z-[60] bg-black/75"
      isOpen={isOpen}
      {...props}
    >
      <Modal
        className={`mir-mobile-dialog-content bg-white ${contentClassName}`}
        aria-label={ariaLabel}
      >
        {children}
      </Modal>
    </ModalOverlay>
  );
}
