import { useForm } from 'react-hook-form';

import mixpanel from '@/core/mixpanel';
import { logger } from '@/core/logger';

import { SurveyStepControls } from '@/modules/survey/components';
import { useSurvey } from '@/modules/survey/hooks';
import { InlineAddress } from '@/modules/program';
import { getPreferredContacts } from '@/modules/program/survey/getPreferredContacts';

import { usePersonOnBoarding } from '../hooks';
import { getIsRoleGPA } from '../utils';

export function OnboardingProviderConfirmation() {
  let survey = useSurvey();
  const { role, provider, updateProvider, doStepNext } = usePersonOnBoarding();
  let {
    handleSubmit,
    formState: { isSubmitted, isValid },
  } = useForm();

  async function submit() {
    try {
      if (getIsRoleGPA(role)) {
        mixpanel.track('Step 9 submitted');
        survey.navigateNext();
      } else {
        await updateProvider({ status: 'COMPLETED' });
        mixpanel.track('Onboarding complete');
        doStepNext({
          historyStep: '/provider/dashboard',
          historyParams: { firstVisit: true },
        });
      }
    } catch (error) {
      logger.error(error);
    }
  }

  let contacts = getPreferredContacts(provider);
  let { remote } = provider;
  const isRemoteStates = remote?.states?.length > 0;
  const { chat, video, voice } = remote || {};

  return (
    <div className="survey-step">
      <p className="mb-3 pl-0.5 font-bold leading-normal text-p-75">Done</p>
      <h1 className="font-sans !text-2xl font-bold">Please confirm we got the following right</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
          <div className="space-y-2 py-6">
            <p>Legal first name:</p>
            <div className="flex space-x-4">
              <p className="font-bold">{provider.legalFirstName}</p>
            </div>
          </div>
          <div className="space-y-2 py-6">
            <p>Legal last name:</p>
            <div className="flex space-x-4">
              <p className="font-bold">{provider.legalLastName}</p>
            </div>
          </div>
          {(provider.locations.length > 0 || isRemoteStates) && (
            <div className="space-y-2 py-6">
              <p>Location: </p>
              {provider?.locations.map(({ address }, index) => (
                <div key={index}>
                  <InlineAddress {...address} className="mb-2 font-bold" />
                </div>
              ))}
              {isRemoteStates && (
                <div>
                  <p className="mb-2 font-bold">
                    <span className="mir-list-commas">
                      Remote -{voice && <span>Voice</span>}
                      {chat && <span>Chat</span>}
                      {video && <span>Video</span>} -
                    </span>
                    <span className="mir-list-commas">
                      {remote?.states?.map(({ code }, index) => (
                        <span key={index}>{code}</span>
                      ))}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 py-6">
            <p>Preferred contact methods: </p>
            {contacts.map((contact) => (
              <div className="flex space-x-4">
                <p className="font-bold">{contact}</p>
              </div>
            ))}
          </div>
        </div>
        <SurveyStepControls disabled={isSubmitted && !isValid} nextButtonLabel="Confirm profile" />
      </form>
    </div>
  );
}
