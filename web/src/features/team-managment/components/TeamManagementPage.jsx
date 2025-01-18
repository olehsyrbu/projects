import { Routes, Route, useNavigate } from 'react-router-dom';
import { ListTeamMembers } from './ListTeamMembers';
import { AddTeamMembers } from './AddTeamMembers';
import PropTypes from 'prop-types';
import { TeamMembersProvider } from './TeamMembersProvider';
import { useAuthContext } from '@/modules/auth';

export function TeamManagementPage({ organizationId }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  function handleReturnToCurrentPage(results) {
    navigate('', { state: { highlight: results.length } });
  }

  return (
    <TeamMembersProvider organizationId={organizationId} userId={user?.id}>
      <Routes>
        <Route index element={<ListTeamMembers onNewTeamMember={() => navigate('add-member')} />} />
        <Route
          path="add-member"
          element={
            <AddTeamMembers
              onAddToTeam={handleReturnToCurrentPage}
              onCancel={handleReturnToCurrentPage}
              organizationId={organizationId}
            />
          }
        />
      </Routes>
    </TeamMembersProvider>
  );
}

TeamManagementPage.propTypes = {
  organizationId: PropTypes.string.isRequired,
};
