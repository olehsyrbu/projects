import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { noop } from '@/core/utils';
import { createPortal } from 'react-dom';

export function EditorActions({ onCancel, onSave, isLoading, isDisabled }) {
  const [container, setContainer] = useState(document.getElementById('edit-actions'));

  useEffect(() => {
    setContainer(document.getElementById('edit-actions'));
  }, []);

  return container
    ? createPortal(
        <div className="bottom-0 bottom-0 bottom-0 z-10 flex w-full items-center justify-center bg-white py-4 shadow-[0px_-3px_10px_rgb(0_0_0_/_6%)] md:static md:h-10 md:bg-transparent md:py-0 md:shadow-none">
          <button
            disabled={isDisabled || isLoading}
            className="mir-button whitespace-nowrap md:!border-solid"
            onClick={onCancel}
          >
            Discard changes
          </button>
          <span className="mx-1" />
          <button
            disabled={isDisabled || isLoading}
            className="mir-button primary"
            onClick={onSave}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>,
        container,
      )
    : null;
}

EditorActions.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

EditorActions.defaultProps = {
  onCancel: noop,
  onSave: noop,
};
