import { Children, cloneElement, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FocusScope } from 'react-aria';

export function Toolbar({ onChange, children, className, ...rest }) {
  const [value, setValue] = useState(rest.value);

  useEffect(() => {
    if (rest.value !== value) {
      setValue(rest.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.value]);

  function toggleValue(newValue) {
    let newValues = value.includes(newValue)
      ? value.filter((value) => value !== newValue)
      : [...value, newValue];

    setValue(newValues);
    onChange(newValues);
  }

  const arrayChildren = Children.toArray(children);

  return (
    <div role="toolbar">
      <FocusScope>
        <div
          className={`flex items-center rounded-[1.5rem] border border-solid border-p-100 bcbs:rounded-none md:inline-flex ${className}`}
          {...rest}
        >
          {Children.map(arrayChildren, (child) =>
            cloneElement(child, {
              selected: value.includes(child.props.value),
              onClick: () => toggleValue(child.props.value),
            }),
          )}
        </div>
      </FocusScope>
    </div>
  );
}

Toolbar.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.node,
  values: PropTypes.array,
  className: PropTypes.string,
};

Toolbar.defaultProps = {
  onChange: () => {},
  value: [],
  className: '',
};
