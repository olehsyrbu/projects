import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { useSurvey } from '@/modules/survey/hooks';
import { Info24Filled as Info } from '@fluentui/react-icons';
import {
  useSaveProgramDraftTypes,
  useAddRemoteProgramDraftTypes,
} from '@/core/api/ProgramDraftQueries';
import { Details, Summary } from '@/features/guided-search/components/Details';
import { InlineAddress, ProgramTypeFieldSet } from '@/modules/program';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { logger } from '@/core/logger';
import { array, object, number } from 'yup';
import { Warning } from '@/modules/form';
import { getMultiProgramTotalTypes } from './getMultiProgramTotalTypes';

const schema = object({
  locations: array().of(
    object({
      types: ProgramTypeFieldSet.schema,
    }),
  ),
  remoteTypes: object().when(['isRemoteStates'], {
    is: (isRemoteStates) => isRemoteStates,
    then: ProgramTypeFieldSet.schema,
  }),
  totalTypesCount: number().test(
    'totalTypesCount',
    'You can create a maximum of 100 programs at a time',
    (_, { parent }) => {
      return getMultiProgramTotalTypes(parent.locations, parent.remoteTypes) <= 100;
    },
  ),
});

export function MultiProgramType({ draft }) {
  let survey = useSurvey();
  let saveLocationTypes = useSaveProgramDraftTypes();
  let addRemoteTypes = useAddRemoteProgramDraftTypes();

  let program = draft?.program;
  let locations = program?.locations || [];
  let states = program?.remote?.states || [];
  let remoteTypes = draft?.types || [];
  const { chat, video, voice } = program?.remote || {};
  let {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      locations: locations.map((location) => ({
        ...location,
        types: typesToObject(location.types),
      })),
      remoteTypes: states.length > 0 ? typesToObject(remoteTypes) : {},
      isRemoteStates: states.length > 0,
    },
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  async function submit(data) {
    const { locations, remoteTypes } = data;
    try {
      if (isDirty) {
        let locationPayload = locations.map((location) => ({
          id: location.id,
          types: typesToArray(location.types),
        }));
        await saveLocationTypes(locationPayload);
        await addRemoteTypes(typesToArray(remoteTypes));

        mixpanel.track('Multiple program types step');
      }

      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="space-y-2 font-sans !text-2xl">
        <span>What types of programs do you offer per location?</span>
      </h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-2 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
          <Info className="text-p-75" />
          <p className="flex-1 leading-6">
            Enter the number of each program type per location (e.g., you offer 3 residential and 2
            intensive outpatient programs at the Ohio location).
          </p>
        </div>
        <Warning
          message={`totalTypesCount.message`}
          className="mt-6 max-w-md bg-warning-3 px-4 py-2 "
          control={control}
        />
        {locations.map(({ address, id }, index) => {
          return (
            <Details open={index === 0} key={index} className={index === 0 && 'border-t-0'}>
              <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
                <div className="flex w-full flex-col items-center justify-between md:flex-row">
                  <InlineAddress {...address} className="flex h-10 items-center" />
                  <Warning
                    message={`locations[${[index]}].types.message`}
                    className="mt-4 max-w-md bg-warning-3 px-4 py-2 md:mt-0 "
                    control={control}
                  />
                </div>
              </Summary>
              <ProgramTypeFieldSet name={`locations.${index}.types`} control={control} />
            </Details>
          );
        })}
        {states.length > 0 && (
          <Details open={!locations.length}>
            <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
              <div className="flex w-full flex-col items-center justify-between md:flex-row">
                <p className="mir-list-commas">
                  Remote -{voice && <span>Voice</span>}
                  {chat && <span>Chat</span>}
                  {video && <span>Video</span>}
                </p>
                <Warning
                  message={`remoteTypes.message`}
                  className="mt-4 max-w-md bg-warning-3 px-4 py-2 md:mt-0 "
                  control={control}
                />
              </div>
            </Summary>
            <ProgramTypeFieldSet type="REMOTE" name={`remoteTypes`} control={control} />
          </Details>
        )}
        <SurveyStepControls />
      </form>
    </article>
  );
}

MultiProgramType.propTypes = {
  draft: PropTypes.object,
};

function typesToObject(types) {
  return types
    .filter(({ type }) => type.length > 0 && type[0].code)
    .reduce((memo, { amount, type }) => {
      memo[type[0].code] = amount;
      return memo;
    }, {});
}

function typesToArray(types) {
  return Object.entries(types)
    .filter(([_, amount]) => amount > 0)
    .map(([type, amount]) => ({ type, amount }));
}
