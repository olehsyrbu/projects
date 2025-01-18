import PropTypes from 'prop-types';
import { TeamNote } from './TeamNote';
import style from './TeamNotesList.module.css';
import { noop } from '@/core/utils';
import { useTeamNotesByProvider } from '@/core/api/TeamNotesQueries';
import { useAuthContext } from '@/modules/auth';

export function TeamNotesList({ onChange, providerId, initialNotes, limit }) {
  const { user } = useAuthContext();
  const organizationId = user.organization.id;
  const { data, mutate } = useTeamNotesByProvider({ id: providerId, organizationId, limit });
  const notes = data.items && data.items.length > 0 ? data.items : initialNotes;
  const isEmpty = notes.length === 0;

  async function doDelete({ id }) {
    onChange({ id, action: 'delete' });

    await mutate(
      {
        ...data,
        items: notes.filter((item) => item.id !== id),
      },
      false,
    );
  }

  return (
    <div className={style.teamList} data-testid="team-note-editor">
      {!isEmpty && (
        <ul data-testid="team-note-editor-list">
          {notes.map(({ id, text, fullName, author, createdAt, organization }) => {
            return (
              <li data-testid={id} key={id}>
                <TeamNote
                  id={id}
                  fullName={fullName}
                  author={author}
                  createdAt={createdAt}
                  organization={organization}
                  onDelete={async (options) => {
                    await doDelete(options);
                  }}
                >
                  {text}
                </TeamNote>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

TeamNotesList.propTypes = {
  providerId: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  initialNotes: PropTypes.array,
  limit: PropTypes.number,
};

TeamNotesList.defaultProps = {
  onChange: noop,
  initialNotes: [],
  limit: 10,
};
