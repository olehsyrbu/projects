import { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Eye20Filled as Eye, EyeOff20Filled as EyeOff } from '@fluentui/react-icons';

export const TextField = forwardRef((props, outerRef) => {
  let { label, className, description, invalid, errorMessage, ...rest } = props;

  let innerRef = useRef();
  let ref = outerRef || innerRef;

  let isInputEmpty = useIsInputEmpty(props, ref);
  let isDisabled = props.disabled;
  let isPassword = props.type === 'password';

  let [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={className}>
      <div
        className={cn(
          'group flex h-12 rounded-lg ring-1 ring-n-40 focus-within:ring-2 focus-within:ring-p-100',
          isDisabled ? 'bg-n-10' : 'hover:ring-p-100',
          { '!ring-error-1': invalid },
          { 'mb-1': description || errorMessage },
        )}
      >
        <label className="flex flex-1 flex-col justify-center pl-3 only:pr-3">
          {label ? (
            <span
              className={cn(
                'mt-1 origin-top-left self-start text-xs leading-none transition-transform',
                invalid ? 'text-error-1' : 'text-hint group-focus-within:text-p-100',
                { 'translate-y-2 scale-[1.334] group-focus-within:transform-none': isInputEmpty },
              )}
            >
              {label}
            </span>
          ) : null}

          <input
            {...rest}
            ref={ref}
            type={passwordVisible ? 'text' : props.type}
            className="bg-transparent outline-none"
          />
        </label>

        {isPassword ? (
          <button
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            className="w-12 flex-none"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <Eye /> : <EyeOff />}
          </button>
        ) : null}
      </div>

      {description && <p className="text-xs text-hint">{description}</p>}
      {errorMessage && <p className="text-xs text-error-1">{errorMessage}</p>}
    </div>
  );
});

function useIsInputEmpty(props, ref) {
  let hasEmptyProps = !props.value && !props.defaultValue && !props.placeholder;
  let [isInputEmpty, setIsInputEmpty] = useState(hasEmptyProps);

  useLayoutEffect(() => {
    let input = ref.current;
    let update = () => setIsInputEmpty(!input.value);
    update();
    input.addEventListener('input', update);
    return () => input.removeEventListener('input', update);
  }, [ref]);

  return isInputEmpty && hasEmptyProps;
}

TextField.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
};
