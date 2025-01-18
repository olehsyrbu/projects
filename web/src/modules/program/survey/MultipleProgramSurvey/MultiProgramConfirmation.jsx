import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { useForm } from 'react-hook-form';
import { logger } from '@/core/logger';
import { useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { useFinishProgramDraft } from '@/core/api/ProgramDraftQueries';
import { useAuthContext } from '@/modules/auth';
import { InlineAddress } from '@/modules/program';
import { SurveyStepControls } from '@/modules/survey/components';
import { getPreferredContacts } from '../getPreferredContacts';

export function MultiProgramConfirmation({ onNext, draft }) {
  const finish = useFinishProgramDraft();
  let { updateUser: refreshAccount } = useAuthContext();
  const programTypes = useProgramTypes();
  const { center, types } = draft || {};
  const program = draft?.program || { locations: [], preferredContacts: [] };
  const contacts = getPreferredContacts(program);
  const { chat, video, voice } = program?.remote || {};
  const isRemoteStates = program.remote?.states?.length > 0;

  const { handleSubmit } = useForm();

  async function onSubmit() {
    try {
      await finish();
      await refreshAccount();

      mixpanel.track('Multiple program confirmation step');
      onNext();
    } catch (e) {
      logger.error(e);
    }
  }

  return (
    <article className="survey-step">
      <p className="mb-3 pl-0.5 font-bold leading-normal text-p-75">Done</p>
      <h1 className="font-sans !text-2xl">Please confirm the following:</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <p>Organization name:</p>
            <div className="flex space-x-4">
              <p className="font-bold">{center}</p>
            </div>
          </div>
          {(program.locations.length > 0 || isRemoteStates) && (
            <div className="space-y-2">
              <p>Location and program types:</p>
              {program.locations?.map(({ address, types }, index) => (
                <div key={index}>
                  <InlineAddress {...address} className="mb-2 font-bold" />
                  <div className="space-y-2">
                    {types.map(({ amount, type }, index) => (
                      <p key={index}>
                        {amount} {programTypes.find(({ id }) => id === type[0].id).name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {isRemoteStates && (
                <div className="mb-2">
                  <p className="mb-2 font-bold">
                    <span className="mir-list-commas">
                      Remote -{voice && <span>Voice</span>}
                      {chat && <span>Chat</span>}
                      {video && <span>Video</span>} -
                    </span>
                    <span className="mir-list-commas">
                      {program.remote?.states?.map(({ code }, index) => (
                        <span key={index}>{code}</span>
                      ))}
                    </span>
                  </p>
                  <div className="space-y-2">
                    {types.map(({ amount, type }, index) => (
                      <p key={index}>
                        {amount} {programTypes.find(({ id }) => id === type[0].id).name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <p>Preferred contact methods: </p>
            {contacts.map((contact) => (
              <div className="flex space-x-4">
                <p className="font-bold">{contact}</p>
              </div>
            ))}
          </div>
        </div>
        <SurveyStepControls nextButtonLabel="Confirm profile" />
      </form>
    </article>
  );
}

MultiProgramConfirmation.propTypes = {
  draft: PropTypes.object,
  onNext: PropTypes.func,
};
