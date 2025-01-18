import cn from 'classnames';
import PropTypes from 'prop-types';

import cx from '../Select.module.css';

export function SelectErrorMessage({ invalid, errorMessage }) {
  return (
    <>
      {invalid && errorMessage && (
        <span className={cn(cx.errorMessage)} role="alert">
          {errorMessage}
        </span>
      )}
    </>
  );
}

SelectErrorMessage.propTypes = {
  errorMessage: PropTypes.string,
  invalid: PropTypes.bool,
};
