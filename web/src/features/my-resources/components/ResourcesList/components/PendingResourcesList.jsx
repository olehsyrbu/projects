import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteInactiveInvitation, useInactiveInvitations } from '@/core/api/InvitationQueries';
import Pagination from '@/core/components/Pagination';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import NoResources from './NoResources';
import NoFilteredResources from './NoFilteredResources';
import { PendingResource } from './PendingResource';
import { EditResourceDialog } from './EditResourceDialog';
import { useAuthContext } from '@/modules/auth';
import { usePendingResourcesState } from '@/features/my-resources/components';
import { Select } from '@/core/components/Select';
import { Switch } from '@/core/components/Switch';
import { pendingOptions } from './Filter.constants';

export default function PendingInvitationList({ initialQuery }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [removing, setRemoving] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState(null);
  const { user } = useAuthContext();
  const [{ items: invitations, pageInfo }, revalidate] = useInactiveInvitations(query);

  const [state, dispatch] = usePendingResourcesState();

  let highlightCount = location.state?.highlight ?? 0;

  useEffect(() => {
    if (highlightCount > 0) {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!invitations.length && pageInfo.page !== 1) {
      handlePageChange(pageInfo.page - 1);
    }
  }, [invitations]);

  function toggleSelection(invitationId) {
    if (state.allSelected) {
      dispatch({ type: 'clear-selection' });

      for (let invitation of invitations) {
        if (invitation.id !== invitationId) {
          dispatch({ type: 'select', resourceId: invitation.id });
        }
      }
      return;
    }

    if (state.selected.has(invitationId)) {
      dispatch({ type: 'deselect', resourceId: invitationId });
    } else {
      dispatch({ type: 'select', resourceId: invitationId });
    }
  }

  async function removeInvitation(id) {
    setRemoving(true);
    await deleteInactiveInvitation(id, user.id);
    await revalidate();
    setRemoving(false);

    if (state.allSelected) {
      dispatch({ type: 'select-all', count: state.selectedCount - 1 });
    } else {
      dispatch({ type: 'deselect', resourceId: id });
    }
  }

  const handlePageChange = (page) => {
    setQuery({
      ...query,
      page,
    });
  };

  const handleSorting = (isSelected) => {
    const sort = isSelected ? { recipient_name: 'ASC' } : { created_at: 'DESC' };
    setQuery({ ...query, sort, page: 1 });
  };

  const handleFiltering = (option) => {
    setQuery({
      ...query,
      page: 1,
      filter: {
        invitation_sent: option.value === 'All' ? null : option.value,
      },
    });
    setFilter(option);
    dispatch({ type: 'clear-selection' });
  };

  return (
    <div className="page-content">
      {state.latestMessage ? (
        <div className="sent-message-status">
          <p>
            <b>Success!</b> You’ve just sent an invitation email to{' '}
            {state.latestMessage.recipientCount} resources.{' '}
          </p>
          <button className="mir-button text" onClick={() => dispatch({ type: 'clear-message' })}>
            <Dismiss />
          </button>
        </div>
      ) : (
        <div className="content-subheader">
          {(invitations.length !== 0 || filter) && (
            <>
              <div className="selection-panel">
                <button
                  className="mir-button text"
                  onClick={() => dispatch({ type: 'select-all', count: pageInfo.totalItems })}
                >
                  Select all
                </button>
                <b>{state.selectedCount} selected</b>
                <button
                  className="mir-button text"
                  onClick={() => dispatch({ type: 'clear-selection' })}
                >
                  Clear
                </button>
              </div>
              <div className="sorting-panel">
                <Select
                  options={pendingOptions}
                  label="Filter by"
                  onChange={handleFiltering}
                  value={filter}
                />
                <Switch className="flex-none" onChange={handleSorting}>
                  A-Z
                </Switch>
              </div>
            </>
          )}
        </div>
      )}
      {invitations.length === 0 && pageInfo.page === 1 ? (
        filter ? (
          <NoFilteredResources onClearFilters={() => handleFiltering(pendingOptions[0])} />
        ) : (
          <NoResources
            title="Hello! You have no pending resources."
            message="Maybe it is time to add more resources to your network?"
          />
        )
      ) : (
        <>
          <div role="list" style={removing ? { opacity: 0.5, pointerEvents: 'none' } : null}>
            {invitations.map((invitation, index) => (
              <PendingResource
                key={invitation.id}
                role="listitem"
                invitation={invitation}
                selected={state.allSelected || state.selected.has(invitation.id)}
                highlighted={index < highlightCount}
                onClick={() => toggleSelection(invitation.id)}
                onEdit={setResourceToEdit}
                onRemove={removeInvitation}
              />
            ))}
          </div>
          {resourceToEdit && (
            <EditResourceDialog
              resource={resourceToEdit}
              onSubmit={async () => {
                await revalidate();
                setResourceToEdit(null);
              }}
              onDismiss={() => setResourceToEdit(null)}
            />
          )}
          {pageInfo.totalItems > pageInfo.perPage && (
            <Pagination
              pageSize={pageInfo.perPage}
              totalPages={pageInfo.totalPages}
              hasPrev={pageInfo.hasPrevPage}
              hasNext={pageInfo.hasNextPage}
              currentPage={pageInfo.page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

PendingInvitationList.propTypes = {
  initialQuery: PropTypes.object,
};

PendingInvitationList.defaultProps = {
  initialQuery: { page: 1, limit: 8, sort: { created_at: 'DESC' } },
};
