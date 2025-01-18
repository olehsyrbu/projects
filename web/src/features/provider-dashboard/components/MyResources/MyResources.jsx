import { useNavigate } from 'react-router-dom';
import { ProvidersGroup, ProvidersHeader } from '@/modules/provider/components';
import { Can } from '@/modules/ability/components';
import { useProviderSubject } from '@/modules/auth/hooks';
import { useAuthContext } from '@/modules/auth';
import { useUserProvider } from '@/core/api/ProviderQueries';

export function MyResources() {
  const navigate = useNavigate();
  const providerSubject = useProviderSubject();
  let { user, refetchUser } = useAuthContext();
  let [provider] = useUserProvider();

  let ownership = user.ownership.map((p) => {
    if (p.id === provider.id) return { ...p, ...provider };
    return p;
  });

  const providers = [...ownership, ...user?.sharedEntities];

  return (
    <div className="fade-in">
      <ProvidersHeader>
        <Can I="create" a={providerSubject}>
          <div className="header-actions mir-dialog-buttons">
            <button className="mir-button primary">Add Group</button>
          </div>
        </Can>
      </ProvidersHeader>
      {providers.length && (
        <ProvidersGroup
          providers={providers}
          onEdit={(id) => navigate(`/provider/resources/edit/${id}`)}
          refetchUser={refetchUser}
        />
      )}
    </div>
  );
}
