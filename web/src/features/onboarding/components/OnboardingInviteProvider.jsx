import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import { logger } from '@/core/logger';
import { updateInvitation } from '@/core/api/InvitationAPI';
import mixpanel from '@/core/mixpanel';
import { useGPAProviders } from '@/core/api/ProviderQueries';
import { useCreateInvite, useLinkInviteToProvider } from '@/core/api/InvitationQueries';
import { SurveyStepControls } from '@/modules/survey/components';
import { useAuthContext } from '@/modules/auth';
import { TextField } from '@/modules/form';
import { usePersonOnBoarding } from '../hooks';

export function OnboardingInviteProvider() {
  const { provider, doStepNext } = usePersonOnBoarding();
  let {
    handleSubmit,
    control,
    formState: { isSubmitted, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(
      object().shape({
        email: string().required('This field is required').email('Please enter an email address'),
      }),
    ),
  });

  const { data, mutate } = useGPAProviders();
  const { user } = useAuthContext();
  const create = useCreateInvite();
  const link = useLinkInviteToProvider();

  async function submit({ email }) {
    const invitation = provider.invitation;

    try {
      if (invitation?.id) {
        await updateInvitation(invitation.id, { email }, true);
      } else {
        const invite = await create({
          recipient_name: `${provider.legalFirstName} ${provider.legalLastName}`,
          message_type: 'EMAIL',
          type: 'PROVIDER',
          email,
          do_send_invitation: true,
        });

        await link(invite.id, provider.id);
      }

      const newItems =
        data.items.length > 0
          ? data.items.filter(({ slug }) => slug !== provider.slug)
          : [...provider];
      mutate({ ...data, items: newItems });

      mixpanel.track('Invite Provider', {
        slug: provider.slug,
        inviter: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

      doStepNext({
        historyStep: '/group-practice/resources',
        historyParams: { isFirstOnboardingVisit: true, id: provider.id },
      });
    } catch (error) {
      setError('email', {
        type: 'manual',
        message:
          'This email address has already been used for another invitation. Please use a unique email address to create a new invitation.',
      });

      logger.error(error);
    }
  }

  return (
    <div className="survey-step">
      <h1 className="font-sans !text-2xl font-bold">Invite provider to activate account</h1>
      <h2 className="font-normal leading-6">
        We will be contacting the provider via email with an invitation to activate their profile.
        <br />
        What is the best email to contact them?
      </h2>

      <form onSubmit={handleSubmit(submit)}>
        <fieldset className="column">
          <div className="onboarding-field">
            <TextField control={control} label="Email" name="email" />
          </div>
        </fieldset>
        <p className="py-2">Once activated, the profile becomes visible to prospective clients.</p>
        <SurveyStepControls
          disabled={isSubmitted && !isValid}
          hasBackControl={false}
          nextButtonLabel="Invite provider"
        />
      </form>
    </div>
  );
}
