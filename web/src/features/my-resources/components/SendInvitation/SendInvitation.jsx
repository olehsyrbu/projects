import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvitationEmail, sendInvitationMessages } from '@/core/api/InvitationQueries';
import { usePendingResourcesState } from '../PendingResourcesStateContext';
import { useAuthContext } from '@/modules/auth';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import './SendInvitation.css';

export default function SendInvitation() {
  let navigate = useNavigate();
  let { user } = useAuthContext();
  let [state, dispatch] = usePendingResourcesState();
  let email = useInvitationEmail();
  let [sending, setSending] = useState(false);

  async function sendInvitations() {
    setSending(true);
    await sendInvitationMessages(state.allSelected ? undefined : [...state.selected], user.id);
    setSending(false);
    dispatch({ type: 'clear-selection' });
    dispatch({ type: 'message-sent', recipientCount: state.selectedCount, sentAt: Date.now() });
    navigate(-1);
  }

  return (
    <Page className="SendInvitationPage">
      <Heading>
        <h1>New message</h1>
      </Heading>
      <Content surface>
        <div className="box">
          <p>
            {state.selectedCount === 1 ? (
              <>
                Below is the email template that will be sent directly to <b>the person selected</b>
                .
              </>
            ) : (
              <>
                Below is the email template that will be sent individually to each of{' '}
                <b>{state.selectedCount} people selected</b>.
              </>
            )}{' '}
            Each email will be stylized and contain the unique sign-up link for each provider.
          </p>

          <dl className="email-preview">
            <dt>Subject line</dt>
            <dd>{email.subject}</dd>
            <br />
            <dt>Text</dt>
            <dd>{email.text}</dd>
          </dl>
        </div>
      </Content>
      <Actions>
        <button
          className="mir-button primary"
          disabled={sending || state.selectedCount === 0}
          onClick={sendInvitations}
        >
          Send
        </button>
        <button className="mir-button" onClick={() => navigate(-1)}>
          Discard
        </button>
      </Actions>
    </Page>
  );
}
