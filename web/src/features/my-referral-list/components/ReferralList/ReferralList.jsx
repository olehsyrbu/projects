import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from '@/core/mixpanel';
import ReferralListCard from './components/ReferralListCard';
import { useReferralList } from '@/modules/referral-list/hooks';
import { ShareDialog } from './components/ShareDialog';
import { createReferralList } from '@/core/api/ReferralListAPI';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import './ReferralList.css';

export function ReferralList() {
  const navigate = useNavigate();
  const referralList = useReferralList();
  const { providers } = referralList;

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [code, setCode] = useState('');

  function handlerAddNewResources() {
    navigate('/search?mode=PERSON');
  }

  async function handleShare() {
    const data = await createReferralList(
      providers.map((provider) => ({
        provider_id: provider.id,
        note: provider.note,
      })),
    );

    setCode(data.code);

    mixpanel.track('Referral List Created', {
      code: data.code,
      providers: providers.map((p) => p.slug),
    });

    setShowShareDialog(true);
  }

  function handleCloseShareDialog() {
    setShowShareDialog(false);
  }

  function handleProviderOpen({ slug, status }) {
    mixpanel.track('Open Provider from Referral list in dashboard', {
      status,
      code,
      slug,
    });
  }

  return (
    <Page className="ReferralList">
      <Heading>
        <h1>Referral List</h1>
      </Heading>
      <Content>
        {showShareDialog ? (
          <ShareDialog
            link={`${window.location.origin}/ref/list/${code}`}
            onClose={handleCloseShareDialog}
          />
        ) : null}
        <ul>
          {providers.map((provider) => (
            <ReferralListCard
              key={provider.id}
              card={provider}
              onOpen={handleProviderOpen}
              onRemoveCard={(id) => referralList.removeProvider(id)}
              onEditNote={({ id, note }) => referralList.setProviderNote(id, note)}
            />
          ))}
        </ul>
      </Content>
      <Actions>
        <button className="mir-button" onClick={() => referralList.clear()}>
          Clear
        </button>
        <button className="mir-button" onClick={handlerAddNewResources}>
          Add resources
        </button>
        <button className="mir-button primary" onClick={handleShare}>
          Share
        </button>
      </Actions>
    </Page>
  );
}
