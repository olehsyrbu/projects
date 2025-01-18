import { NavigationPrompt } from '@/core/components/NavigationPrompt';
import PropTypes from 'prop-types';

export function UnsavedDataPrompt({ when }) {
  return (
    <NavigationPrompt
      when={when}
      title="Unsaved changes"
      message="Please save your changes before exiting your profile. If you exit without saving, your
        changes will be lost."
    />
  );
}

UnsavedDataPrompt.propTypes = {
  when: PropTypes.bool,
};
