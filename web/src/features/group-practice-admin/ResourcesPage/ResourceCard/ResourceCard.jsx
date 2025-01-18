import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

import { ResourceCard as ProviderCard } from '@/modules/provider/components';
import { ResourceCardActions } from './ResourceCardActions';
import { ResourceCardDetailsActivated, ResourceCardDetailsPending } from './ResourceCardDetails';
import { ActionsSubDetailsActivated, ActionsSubDetailsPending } from './ResourceCardSubDetails';

export function ResourceCard({
  path,
  selected,
  profile,
  onDeleteProfile,
  onResendEmail,
  onChangeEmail,
}) {
  let navigate = useNavigate();

  let {
    id,
    invitation,
    email,
    updatedAt,
    availability,
    mobile,
    status,
    photoUrl,
    tagLine,
    legalLastName,
    legalFirstName,
    active,
    slug,
  } = profile || {};

  let invitationEmail = invitation?.email;

  function handleEditProfile() {
    if (invitationEmail) {
      navigate(`${path}/edit/${id}`);
    } else {
      navigate(`${path}/onboarding/${id}/*`);
    }
  }

  function handleResendEmail() {
    onResendEmail(invitation);
  }

  function handleChangeEmail() {
    onChangeEmail(invitation);
  }

  let providerStatus = 'activated';
  switch (status) {
    case 'COMPLETED':
      providerStatus = 'activated';
      break;
    case 'ONBOARDING':
      providerStatus = 'onboarding';
      break;
    case 'UNCLAIMED':
    case 'PENDING':
      providerStatus = 'pending';
      break;
    default:
      providerStatus = 'activated';
  }

  const isProviderActivated = providerStatus === 'activated';

  const classesResourceCard = cn({
    '!bg-graphics-10': providerStatus === 'pending' || !active,
    '!bg-p-10': selected,
  });

  const classesRenderName = cn({
    'opacity-50': providerStatus === 'pending',
    'mt-2': providerStatus === 'onboarding',
  });

  function handleDeleteProvider() {
    onDeleteProfile(id, isProviderActivated);
  }

  return (
    <ProviderCard
      key={id}
      id={id}
      className={classesResourceCard}
      photo={{ src: photoUrl, alt: 'GPA provider profile' }}
      providerLink={status === 'COMPLETED' ? `/provider/${slug}` : null}
      renderName={() => (
        <p className={classesRenderName}>
          {legalFirstName} {legalLastName}
        </p>
      )}
      renderActions={() => (
        <ResourceCardActions
          isProviderActivated={isProviderActivated}
          onEditProfile={handleEditProfile}
          onDeleteProfile={handleDeleteProvider}
        />
      )}
      renderDetails={() => {
        switch (providerStatus) {
          case 'activated':
            return <ResourceCardDetailsActivated tagLine={tagLine} deactivated={!active} />;
          case 'pending':
            return (
              <ResourceCardDetailsPending
                tagLine={tagLine}
                sentAt={invitation.sentAt}
                onResend={handleResendEmail}
              />
            );
          default:
            return tagLine ? <div className="md:w-1/2">{tagLine}</div> : null;
        }
      }}
      renderSubDetails={() => {
        switch (providerStatus) {
          case 'activated':
            return (
              <ActionsSubDetailsActivated
                email={email}
                mobile={mobile}
                updatedAt={updatedAt}
                availability={availability}
                deactivated={!active}
              />
            );
          case 'pending':
            return (
              <ActionsSubDetailsPending email={invitationEmail} onChangeEmail={handleChangeEmail} />
            );
          default:
            return null;
        }
      }}
    />
  );
}

ResourceCard.defaultProps = {
  path: '/group-practice/resources',
};

ResourceCard.propTypes = {
  selected: PropTypes.bool,
  path: PropTypes.string,
  onDeleteProfile: PropTypes.func,
  onResendEmail: PropTypes.func,
  onChangeEmail: PropTypes.func,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    tagLine: PropTypes.string,
    providerTypes: PropTypes.array,
    mobile: PropTypes.string,
    legalFirstName: PropTypes.string,
    legalLastName: PropTypes.string,
    photoUrl: PropTypes.string,
    availability: PropTypes.shape({
      status: PropTypes.string,
      updated_at: PropTypes.string,
    }),
    preferredContacts: PropTypes.array,
    updatedAt: PropTypes.string,
  }),
};
