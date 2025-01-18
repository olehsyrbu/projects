import { Routes, Route } from 'react-router-dom';
import ResourcesImport from './components/ResourcesImport';
import SendInvitation from './components/SendInvitation';
import { PendingResourcesStateProvider } from './components/PendingResourcesStateContext';
import { Can } from '@/modules/ability/components';
import { InvitationAction, useInvitationSubject } from '@/modules/auth/hooks';
import ResourcesList from '@/features/my-resources/components/ResourcesList';

export default function ResourcesPage() {
  const invitationSubject = useInvitationSubject();

  return (
    <PendingResourcesStateProvider>
      <Routes>
        <Route
          index
          element={
            <Can I={InvitationAction.Read} a={invitationSubject} passThrough>
              {(allowed) => <ResourcesList type={allowed ? 'pending' : 'active'} />}
            </Can>
          }
        />
        <Route path="import" element={<ResourcesImport />} />
        <Route path="send-invite" element={<SendInvitation />} />
      </Routes>
    </PendingResourcesStateProvider>
  );
}
