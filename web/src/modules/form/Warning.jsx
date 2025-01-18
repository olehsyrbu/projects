import PropTypes from 'prop-types';
import { useFormState } from 'react-hook-form';
import { Alert } from '@/core/components';
import { Warning16Regular as WarningIcon } from '@fluentui/react-icons';
import { get } from 'lodash-es';

export function Warning({ message, control, className }) {
  const { errors } = useFormState({ control });
  const text = get(errors, `${message}`);

  if (!text) {
    return null;
  }

  return <Alert className={`bg-warning-3 ${className}`} text={text} icon={<WarningIcon />} />;
}

Warning.propTypes = {
  control: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Warning.defaultProps = {
  className: '',
};
