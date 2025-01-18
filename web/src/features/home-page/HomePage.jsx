import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from '@/core/mixpanel';
import { toAdvancedSearchParams } from '@/modules/search/utils';
import { useOrganization } from '@/modules/organization';
import { MiResourceHomePage } from './MiResource';
import { BcbsksHomePage } from './Bcbsks';
import { InsuranceHomePage } from './InsuranceHomePage';
import { useFlag } from '@/core/feature-split';

export function HomePage() {
  const navigate = useNavigate();
  const organization = useOrganization();
  let isInsuranceHomePageEnabled = useFlag('insurance-home-page');

  useEffect(() => {
    mixpanel.track('Home Page Visit');
  }, []);

  function handleSearchRedirect(form) {
    const query = toAdvancedSearchParams(form);
    navigate(`/search?${query}`);
  }

  if (organization?.subdomain === 'bcbsks') {
    return <BcbsksHomePage onSearch={handleSearchRedirect} />;
  }

  return isInsuranceHomePageEnabled ? (
    <InsuranceHomePage onSearch={handleSearchRedirect} />
  ) : (
    <MiResourceHomePage onSearch={handleSearchRedirect} />
  );
}
