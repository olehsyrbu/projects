import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mixpanel from '@/core/mixpanel';
import { useReferralListByCode } from '@/core/api/ReferralListQueries';
import Logo from '@/modules/app-shell/Logo';
import ReferralListCard from '../ReferralList/components/ReferralListCard';
import './ReferralListStudentsPage.css';

function ReferralListStudentsPage() {
  let { code } = useParams();
  const { providers } = useReferralListByCode(code);

  useEffect(() => {
    mixpanel.track('Referral List Visit', {
      code,
      slugs: providers?.map(({ slug }) => slug),
    });
  }, [code, providers]);

  if (!code) {
    return (
      <main>
        <Logo />
        <h1>Sorry your link is wrong!</h1>
      </main>
    );
  }

  function handleProviderOpen({ slug, status }) {
    mixpanel.track('Open Provider from Referral List', {
      status,
      code,
      slug,
    });
  }

  return (
    <main className="mir-content ReferralListStudentPage student-view">
      <Logo />
      {providers ? (
        <>
          <h1>Your referral list</h1>
          <ul>
            {providers.map(
              ({ provider, note }) =>
                //TODO: MIR-2349 referralListByCode should return only active providers
                provider.active && (
                  <ReferralListCard
                    onOpen={handleProviderOpen}
                    studentMode={true}
                    key={provider.id}
                    card={{ ...provider, note }}
                  />
                ),
            )}
          </ul>
        </>
      ) : (
        <>
          <h1>You don`t have a list of Providers</h1>
          <p>Please contact with you referral coordinator!</p>
        </>
      )}
    </main>
  );
}

ReferralListStudentsPage.propTypes = {};

export default ReferralListStudentsPage;
