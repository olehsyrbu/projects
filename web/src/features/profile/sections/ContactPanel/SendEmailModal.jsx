import '@/core/utils/validatePhoneNumber';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import PropTypes from 'prop-types';
import {
  Copy24Regular as Copy,
  Checkmark20Filled as Checkmark,
  Warning20Regular as Warning,
  ChevronLeft24Filled as ChevronLeft,
} from '@fluentui/react-icons';
import { pickBy } from 'lodash-es';
import { ROLE_NAMES } from '@/core/definitions';
import mixpanel from '@/core/mixpanel';
import { sentProviderEmail } from '@/core/api/ProviderAPI';
import { Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@/core/components';
import { useFlag } from '@/core/feature-split';
import { useAuthContext } from '@/modules/auth';
import { TextArea, TextField } from '@/modules/form';
import { getEventProperties } from '../../getEventProperties';

export function SendEmailModal({ profile, onDismiss, onBack }) {
  const { user } = useAuthContext();
  const [statusSent, setStatusSent] = useState(null);

  const reachOutPhoneFlag = useFlag('reach-out-phone');
  const confirmEmailFlag = useFlag('confirm-email');

  let { control, formState, handleSubmit } = useForm({
    resolver: yupResolver(
      object({
        name: string().required('This field is required'),
        message: string().required('This field is required'),
        phone: (reachOutPhoneFlag ? string().required('This field is required') : string()).phone(
          'Please enter a phone number, example: (234) 567-8910',
        ),
        email: string().email('Please enter an email address').required('This field is required'),
        confirmEmail:
          confirmEmailFlag &&
          string()
            .email('Please type your email to confirm.')
            .required('This field is required')
            .test(
              'confirmEmail',
              'Oops! These emails don’t match (please check).',
              (confirmEmail, { parent }) => {
                return confirmEmail === parent.email;
              },
            ),
      }),
    ),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      confirmEmail: '',
    },
  });

  const { isSubmitSuccessful, isSubmitting } = formState;

  async function submitForm(data) {
    try {
      const response = await sentProviderEmail(profile.slug, pickBy(data, Boolean));

      if (response.status >= 400) {
        setStatusSent('failed');
        return;
      }

      setStatusSent('success');
      mixpanel.track('Schedule email Sent', { ...getEventProperties(profile), channel: 'email' });
    } catch (e) {
      setStatusSent('failed');
    }
  }

  if (statusSent === 'success') {
    return <MessageSentModal profile={profile} onDismiss={onDismiss} onBack={onBack} />;
  }

  return (
    <Dialog isOpen onDismiss={onDismiss}>
      <DialogTitle>
        <span className="max-md:hidden">
          Reach out to {profile.mode === 'PROGRAM' ? 'the program' : profile.legalFirstName}
        </span>
        <div className="flex items-center md:hidden">
          <button aria-label="Back" className="mr-5 text-p-100" onClick={onBack}>
            <ChevronLeft />
          </button>
          <span className="flex-1 text-center">Send email</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitForm)}>
          <p className="mb-6 text-xl font-bold md:hidden">
            Reach out to {profile.mode === 'PROGRAM' ? 'the program' : profile.legalFirstName}
          </p>
          <div>
            {profile.email && user?.role === ROLE_NAMES.REFERRAL_COORDINATOR ? (
              <Email email={profile.email} />
            ) : null}

            <p className="mb-1 font-bold">
              How can {profile.mode === 'PROGRAM' ? 'the program' : profile.legalFirstName} contact
              you?
            </p>
            <p className="mb-5">
              This information will only be shared with{' '}
              {profile.mode === 'PROGRAM'
                ? 'the program'
                : `${profile.legalFirstName} ${profile.legalLastName}`}{' '}
              so they can contact you.
            </p>

            <div className="mb-6 space-y-5">
              <TextField label="Name" name="name" control={control} />
              <TextField label="Email" type="email" name="email" control={control} />
              {confirmEmailFlag && (
                <TextField
                  label="Confirm email"
                  name="confirmEmail"
                  type="email"
                  defaultValue=""
                  autoComplete="off"
                  control={control}
                  onPaste={(event) => event.preventDefault()}
                  onDrop={(event) => event.preventDefault()}
                />
              )}
              <TextField
                label={reachOutPhoneFlag ? 'Phone' : 'Phone (optional)'}
                name="phone"
                control={control}
              />
            </div>

            <div className="space-y-3">
              <p className="font-bold">
                Let {profile.mode === 'PROGRAM' ? 'the program' : profile.legalFirstName} know about
                your interest in their {profile.mode === 'PROGRAM' ? 'program' : 'practice'}
              </p>

              <p>Please don’t include sensitive mental health information.</p>

              <TextArea
                name="message"
                control={control}
                placeholder={
                  profile.mode === 'PROGRAM'
                    ? 'Feel free to ask any questions about their services, facilities, and rules to learn what to expect if you attend this program. Also, you can let them know the best times to reach you by phone to schedule an appointment.'
                    : `Feel free to ask ${profile.legalFirstName} questions about their practice or let them know the best times to reach you by phone to schedule an appointment.`
                }
                minRows={5}
                maxRows={7}
                maxLength={700}
              />

              {statusSent === 'failed' && (
                <Alert
                  className="bg-warning-3"
                  text="Something went wrong. Please try again."
                  icon={<Warning />}
                />
              )}
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <button
          className="mir-button primary"
          disabled={isSubmitting || (isSubmitSuccessful && statusSent === 'success')}
          onClick={handleSubmit(submitForm)}
        >
          Contact {profile.mode === 'PROGRAM' ? 'program' : 'provider'}
        </button>
        <button type="button" className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

function Email({ email }) {
  let [copied, setCopied] = useState(false);

  let copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 5000);
    }
  }, [copied]);

  return (
    <div className="mb-6 flex flex-wrap items-center">
      <p className="mr-2.5 font-bold">
        Email:{' '}
        <a href={`mailto:${email}`} className="text-p-100">
          {email}
        </a>
      </p>
      {copied ? (
        <p className="flex items-center text-sm text-[#02a3ab]">
          <Checkmark className="mr-1" />
          Copied
        </p>
      ) : (
        <button aria-label="Copy email" className="text-p-100" onClick={copy}>
          <Copy />
        </button>
      )}
    </div>
  );
}

function MessageSentModal({ profile, onDismiss, onBack }) {
  return (
    <Dialog isOpen onDismiss={onDismiss}>
      <DialogTitle>
        <span className="max-md:hidden">Your message was sent!</span>
        <div className="flex items-center md:hidden">
          <button aria-label="Back" className="mr-5 text-p-100" onClick={onBack}>
            <ChevronLeft />
          </button>
          <span className="flex-1 text-center">Send email</span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="md:max-w-[29rem]">
          <p className="mb-2 text-xl font-bold md:hidden">Your message was sent!</p>
          {profile.mode === 'PROGRAM' ? (
            <>
              <p>{`We sent your email to the ${profile.name} program to get started on getting you a spot.`}</p>
              <p className="mt-6">
                {`While waiting to hear back from ${profile.name} program, we encourage you to keep looking for programs and
                message others you are interested in. Contacting multiple programs can increase your chances of getting a
                spot that fits your schedule sooner.`}
              </p>
            </>
          ) : (
            <>
              <p>{`We sent your email to ${profile.legalFirstName} to get started on getting you an appointment.`}</p>
              <p className="mt-6">
                {`While waiting to hear back from ${profile.legalFirstName}, we encourage you to keep looking for providers and
                  message others you are interested in seeing. Contacting multiple providers can increase
                  your chances of getting an appointment that fits your schedule sooner.`}
              </p>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={onDismiss}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}

SendEmailModal.propTypes = {
  profile: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

Email.propTypes = {
  email: PropTypes.string.isRequired,
};

MessageSentModal.propTypes = {
  profile: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
