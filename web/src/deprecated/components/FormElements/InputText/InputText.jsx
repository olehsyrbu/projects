import { forwardRef, useId } from 'react';
import cn from 'classnames';

const InputText = forwardRef(
  (
    { id, className, inputClassName, label, symbol, invalid, errorMessage, children, ...rest },
    ref,
  ) => {
    let innerId = useId();
    let elementId = id || innerId;
    return (
      <div className={cn('input-text', inputClassName)}>
        <input
          ref={ref}
          id={elementId}
          {...rest}
          placeholder={label}
          className={cn(className, { 'has-symbol': symbol, 'border-error': invalid })}
        />

        <label htmlFor={elementId} className={cn('label ', { 'label-error': invalid })}>
          {label}
        </label>

        {symbol && <div className="symbol">{symbol}</div>}

        {invalid && errorMessage && (
          <span className="error-message" role="alert">
            {errorMessage}
          </span>
        )}
        {children}
      </div>
    );
  },
);

export default InputText;
