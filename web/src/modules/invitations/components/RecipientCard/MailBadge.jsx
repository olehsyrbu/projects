import * as PropTypes from 'prop-types';
import { Mail16Regular as Mail } from '@fluentui/react-icons';

export function MailBadge({ label }) {
  return (
    <>
      <Mail />
      {label}
    </>
  );
}

MailBadge.propTypes = {
  label: PropTypes.string.isRequired,
};
