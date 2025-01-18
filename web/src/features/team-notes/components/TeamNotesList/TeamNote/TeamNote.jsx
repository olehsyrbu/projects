import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import style from './TeamNote.module.css';
import { TeamNoteDatetimeFormat } from './TeamNoteDatetimeFormat';
import { subject } from '@casl/ability';
import { Can } from '@/modules/ability/components';

export function TeamNote({ id, children, onDelete, fullName, author, createdAt, organization }) {
  function handleDelete() {
    onDelete({ id, organizationId: organization?.id });
  }

  return (
    <div className={style.noteContainer} data-testid={`team-note-${id}`}>
      <div className={style.noteHeader}>
        <span>{author ? fullName : `${fullName} (deleted)`}</span>
        <span> | </span>
        {createdAt && <TeamNoteDatetimeFormat date={createdAt} />}
      </div>
      <div className={style.noteMessage}>{children}</div>
      <div className={style.noteAction}>
        <Can
          I="delete"
          a={subject('TeamNote', {
            author,
            organization,
          })}
          passThrough
        >
          {(allowed) => (
            <button
              disabled={!allowed}
              className="mir-button text"
              style={{ paddingRight: 0 }}
              onClick={handleDelete}
            >
              <span>Delete</span>
            </button>
          )}
        </Can>
      </div>
    </div>
  );
}

TeamNote.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  onDelete: PropTypes.func,
  fullName: PropTypes.string,
  author: PropTypes.object,
  createdAt: PropTypes.string,
  organization: PropTypes.object,
};

TeamNote.defaultProps = {
  onDelete: noop,
  author: null,
  organization: null,
};
