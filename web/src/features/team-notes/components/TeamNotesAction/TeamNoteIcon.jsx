import PropTypes from 'prop-types';
import { Notepad24Filled as Notepad } from '@fluentui/react-icons';

export function TeamNoteIcon({ showBadge = false }) {
  return showBadge ? (
    <svg width={27} height={24}>
      <Notepad />
      {showBadge && (
        <circle data-testid="team-note-indicator" cx="18" cy="20" r="4" fill="#79D297" />
      )}
    </svg>
  ) : (
    <Notepad />
  );
}

TeamNoteIcon.propTypes = {
  showBadge: PropTypes.bool,
};

TeamNoteIcon.defaultProps = {
  showBadge: false,
};
