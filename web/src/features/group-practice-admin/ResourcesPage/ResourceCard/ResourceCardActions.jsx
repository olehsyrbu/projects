import PropTypes from 'prop-types';
import {
  DismissCircle20Filled as DismissCircle,
  Edit20Filled as Edit,
  LinkDismiss24Filled as LinkDismiss,
} from '@fluentui/react-icons';
import { noop } from '@/core/utils';
import { Button } from 'react-aria-components';

export function ResourceCardActions({ onEditProfile, onDeleteProfile, isProviderActivated }) {
  return (
    <>
      <Button aria-label="Edit" className="mir-button text button-text-xs" onClick={onEditProfile}>
        <Edit />
        <span className="block lg:hidden">Edit</span>
      </Button>
      <Button
        aria-label="Remove"
        className="mir-button text button-text-xs"
        onClick={onDeleteProfile}
      >
        {isProviderActivated ? <LinkDismiss /> : <DismissCircle />}
        <span className="block lg:hidden">Remove</span>
      </Button>
    </>
  );
}

ResourceCardActions.defaultProps = {
  onEditProfile: noop,
  onDeleteProfile: noop,
  isProviderActivated: false,
};
ResourceCardActions.propTypes = {
  onEditProfile: PropTypes.func,
  onDeleteProfile: PropTypes.func,
  isProviderActivated: PropTypes.bool,
};
