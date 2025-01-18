import { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { mergeRefs } from 'react-merge-refs';
import { useActualValue } from '@/core/hooks';

export let TextArea = forwardRef(({ className, errorMessage, ...rest }, ref) => {
  let innerRef = useRef();
  let value = useActualValue(innerRef, rest.value);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <TextareaAutosize
          ref={mergeRefs([innerRef, ref])}
          className="peer box-border block w-full resize-none rounded-lg border-none px-3 py-2 font-sans text-base outline-none placeholder:text-hint disabled:bg-graphics-10 disabled:text-hint"
          {...rest}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-lg border border-solid border-graphics-50',
            'peer-hover:border-2 peer-hover:border-p-75',
            'peer-focus:border-2 peer-focus:border-p-75',
            {
              'border-error-1 peer-hover:border-error-1 peer-focus:border-error-1': errorMessage,
            },
            'peer-disabled:border peer-disabled:border-graphics-50',
          )}
        />
      </div>
      {!errorMessage && rest.maxLength && (
        <p className="text-xs font-light">
          {value ? `${value.length}/` : ''}
          {rest.maxLength} characters max
        </p>
      )}
      {errorMessage && <p className="text-xs font-light text-error-1">{errorMessage}</p>}
    </div>
  );
});

TextArea.propTypes = {
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
};

TextArea.defaultProps = {
  minRows: 3,
};
