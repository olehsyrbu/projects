import { useNavigate } from 'react-router-dom';
import { useMatchMedia } from '@/core/hooks';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import './EmptyReferralList.css';

export function EmptyReferralList() {
  let navigate = useNavigate();
  let wideScreen = useMatchMedia('(min-width: 768px)');

  const handleStartSession = () => {
    navigate('/search?mode=PERSON', { replace: true });
  };

  return (
    <Page className="empty-referral-list">
      <Heading>
        <h1>Referral List</h1>
      </Heading>
      <Content surface>
        <section>
          <h2 className="font-bold">Create your first Referral List</h2>
          <p>
            Click the “Create referral list” button and you will be taken to the search results page
            to select the providers who best match the needs of your students.
          </p>
          {wideScreen && (
            <button className="mir-button primary" onClick={handleStartSession}>
              Create referral list
            </button>
          )}
        </section>
      </Content>
      <Actions>
        {!wideScreen && (
          <button className="mir-button primary" onClick={handleStartSession}>
            Create referral list
          </button>
        )}
      </Actions>
    </Page>
  );
}
