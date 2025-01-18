import { useNavigate, useParams } from 'react-router-dom';
import { ProviderDashboardWrapper } from '@/features/provider-dashboard/components';
import { ProviderEdit } from '@/features/profile-edit';
import cx from './ProviderEditPage.module.css';
import PropTypes from 'prop-types';

export function ProviderEditPage({ path }) {
  let navigate = useNavigate();
  let { providerId } = useParams();
  return (
    <div className={`${cx.GPAEditProfile} md:-ml-12 md:-mt-8 md:max-w-[68rem]`}>
      <ProviderDashboardWrapper>
        <div id="content">
          <ProviderEdit id={providerId} onBack={() => navigate(path)} />
        </div>
      </ProviderDashboardWrapper>
    </div>
  );
}

ProviderEditPage.propTypes = {
  path: PropTypes.string,
};
ProviderEditPage.defaultProps = {
  path: '/group-practice/resources',
};
