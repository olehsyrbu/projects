import { Navigate, NavLink, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import { useUserProvider } from '@/core/api/ProviderQueries';
import Sidebar from '@/modules/app-shell/Sidebar';
import { MobileNavbar } from '@/modules/app-shell';
import {
  CongratsModal,
  MyDashboard,
  MyResources,
  ProviderDashboardWrapper,
} from '@/features/provider-dashboard/components';
import { PrimarySubdomainRedirect } from '@/modules/auth/components';
import { ProviderEdit } from '../profile-edit';

export default function ProviderDashboard() {
  let location = useLocation();
  let navigate = useNavigate();
  let params = useParams();

  let [provider] = useUserProvider(params.providerId);

  let dashboard = useMatch('/provider/dashboard');
  let resources = useMatch('/provider/resources');
  let edit = useMatch('/provider/resources/edit/*');

  function closeCongratsModal() {
    navigate(location.pathname, { replace: true, state: { firstVisit: false } });
  }

  function editProvider() {
    navigate(`/provider/resources/edit/${provider.id}`);
  }

  function handlePrimarySubdomainTransition() {
    navigate(location.pathname, { replace: true, state: { firstVisit: false } });
  }

  if (provider.status === 'ONBOARDING') {
    return <Navigate to="/provider/onboarding" replace />;
  }

  function handleBack() {
    navigate('/provider/dashboard');
  }

  return (
    <ProviderDashboardWrapper>
      <PrimarySubdomainRedirect onTransition={handlePrimarySubdomainTransition} />
      {location.state?.firstVisit && (
        <CongratsModal onEditProvider={editProvider} onCloseModal={closeCongratsModal} />
      )}
      <Sidebar>
        <NavLink to="/provider/dashboard">My dashboard</NavLink>
        <NavLink to="/provider/resources">My resources</NavLink>
      </Sidebar>
      <MobileNavbar>
        <NavLink to="/provider/dashboard">My dashboard</NavLink>
        <NavLink to="/provider/resources">My resources</NavLink>
      </MobileNavbar>
      <div id="content">
        {dashboard && <MyDashboard />}
        {resources && <MyResources />}
        {edit && <ProviderEdit id={provider.id} onBack={handleBack} />}
      </div>
    </ProviderDashboardWrapper>
  );
}
