import { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import cn from 'classnames';
import { useMatchMedia } from '@/core/hooks';
import { Tooltip } from '@/core/components/Tooltip';
import { usePendingResourcesState } from '../PendingResourcesStateContext';
import PendingResourcesList from './components/PendingResourcesList';
import { ActiveResourcesList } from './components/ActiveResourcesList';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import { Can } from '@/modules/ability/components';
import { useInvitationSubject, InvitationAction } from '@/modules/auth/hooks';
import './ResourcesList.css';

export default function ResourcesList({ type }) {
  let navigate = useNavigate();
  let location = useLocation();
  const activeTab = location.state?.activeTab;
  let [section, setSection] = useState(activeTab || type);
  let [state] = usePendingResourcesState();
  let narrowScreen = useMatchMedia('(max-width: 768px)');
  const invitationSubject = useInvitationSubject();

  useEffect(() => {
    if (activeTab === 'active') {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return (
    <Page className="resources-list">
      <Heading>
        <h1>My Resources</h1>
        <Can I={InvitationAction.Read} a={invitationSubject}>
          <div className="mir-segmented-buttons page-toolbar">
            <Tooltip label="These providers have accepted your invitation and are registered with MiResource.">
              <button
                className={cn('mir-button', {
                  compact: narrowScreen,
                  primary: section === 'active',
                })}
                onClick={() => setSection('active')}
              >
                Active
              </button>
            </Tooltip>
            <Tooltip label="These providers have been invited to MiResource and have not accepted your invitation.">
              <button
                className={cn('mir-button !rounded-r-xl', {
                  compact: narrowScreen,
                  primary: section === 'pending',
                })}
                onClick={() => setSection('pending')}
              >
                Pending
              </button>
            </Tooltip>
          </div>
        </Can>
      </Heading>
      <Content>
        <Suspense fallback={null}>
          {section === 'active' ? <ActiveResourcesList /> : <PendingResourcesList />}
        </Suspense>
      </Content>
      <Actions>
        <Can I={InvitationAction.Create} a={invitationSubject}>
          <>
            <button
              className="mir-button"
              disabled={state.selectedCount === 0}
              onClick={() => navigate('send-invite')}
            >
              Send invite
            </button>
            <button className="mir-button" onClick={() => navigate('import')}>
              Add resources
            </button>
          </>
        </Can>
      </Actions>
    </Page>
  );
}

ResourcesList.propTypes = {
  type: PropTypes.oneOf(['active', 'pending']),
};

ResourcesList.defaultProps = {
  type: 'pending',
};
