import { forwardRef } from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import cn from 'classnames';

export let Checkbox = forwardRef(({ children, className, ...rest }, ref) => {
  return (
    <AriaCheckbox
      {...rest}
      ref={ref}
      className={({ isDisabled }) =>
        cn('inline-flex', { 'cursor-pointer': !isDisabled }, className)
      }
    >
      {({ isSelected, isIndeterminate, isDisabled, isFocusVisible }) => (
        <>
          <svg
            width="22"
            height="22"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('m-px block flex-none rounded border-2 border-current', {
              'bg-current': isSelected,
              ring: isFocusVisible,
            })}
            style={{ color: isDisabled ? 'var(--p-55)' : 'var(--p-100)' }}
            aria-hidden="true"
          >
            {isSelected ? (
              <polyline points="5,9 8,12 14,6" stroke="white" />
            ) : isIndeterminate ? (
              <polyline points="4.5,9 13.5,9" stroke="currentColor" />
            ) : null}
          </svg>

          {children ? (
            <span className={cn('ml-2 mt-[calc(12px-0.75em)]', { 'text-hint': isDisabled })}>
              {children}
            </span>
          ) : null}
        </>
      )}
    </AriaCheckbox>
  );
});

Checkbox.propTypes = AriaCheckbox.propTypes;
