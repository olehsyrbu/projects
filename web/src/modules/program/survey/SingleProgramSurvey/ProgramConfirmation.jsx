import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useAuthContext } from '@/modules/auth';
import { SurveyStepControls } from '@/modules/survey/components';
import { InlineAddress } from '@/modules/program';
import { logger } from '@/core/logger';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { getPreferredContacts } from '../getPreferredContacts';
import mixpanel from '@/core/mixpanel';

export function ProgramConfirmation({ program, onNext }) {
  let { center, locations, programType, remote } = program;
  let contacts = getPreferredContacts(program);
  let update = useUpdateProgram();
  let { updateUser: refreshAccount } = useAuthContext();
  const isRemoteStates = remote?.states?.length > 0;
  const { chat, video, voice } = remote || {};

  let { handleSubmit } = useForm();

  async function submit() {
    try {
      await update(program.id, { status: 'COMPLETED' });
      await refreshAccount();

      mixpanel.track('Single program confirmation step');
      onNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <p className="mb-3 pl-0.5 font-bold leading-normal text-p-75">Done</p>
      <h1 className="font-sans !text-2xl font-bold">Please confirm the following:</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6">
          <div className="space-y-2">
            <p>Organization name:</p>
            <div className="flex space-x-4">
              <p className="font-bold">{center}</p>
            </div>
          </div>
          {(locations.length > 0 || isRemoteStates) && (
            <div className="space-y-2">
              <p>Location and program type:</p>
              {locations.map(({ address }, index) => (
                <div key={index}>
                  <InlineAddress {...address} className="mb-2 font-bold" />
                  <p className="space-y-2">{programType.name}</p>
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
                  <p className="space-y-2">{programType.name}</p>
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

ProgramConfirmation.propTypes = {
  program: PropTypes.object,
  onNext: PropTypes.func,
};
