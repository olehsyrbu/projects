import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { Radio } from '@/modules/form';
import { LocationFieldSet, RemoteFieldSet } from '@/modules/program';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import mixpanel from '@/core/mixpanel';

let schema = object({
  location: object().when('type', { is: 'inPerson', then: LocationFieldSet.schema }),
  remote: object().when('type', { is: 'remote', then: RemoteFieldSet.schema }),
});

export function ProgramLocation({ program }) {
  let survey = useSurvey();
  let updateProgram = useUpdateProgram();

  let {
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: program?.remote?.available ? 'remote' : 'inPerson',
      location: program?.locations[0] ?? {},
      remote: program?.remote ?? {},
    },
  });

  let type = watch('type');

  async function submit(data) {
    if (isDirty) {
      let patch = {
        inPerson: { available: false },
        remote: { available: false, voice: false, chat: false, video: false, states: [''] },
        locations: [],
      };

      if (type === 'inPerson') {
        patch.inPerson.available = true;
        patch.locations.push(LocationFieldSet.toApiValue(data.location));
      }

      if (type === 'remote') {
        patch.remote = {
          ...data.remote,
          available: true,
          states: data.remote.states.map((s) => s.code),
        };
      }

      await updateProgram(program.id, patch);

      mixpanel.track('Single program location step');
    }

    survey.navigateNext();
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">Where are you offering services?</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-8">
          <div className="space-y-4">
            <Radio className="items-center" name="type" value="inPerson" control={control}>
              <span className="text-xl font-bold">In-person location</span>
            </Radio>
            {type === 'inPerson' && (
              <LocationFieldSet
                mode="PROGRAM"
                name="location"
                control={control}
                onClear={() => {
                  setValue(
                    'location',
                    { ...LocationFieldSet.defaultLocation },
                    { shouldDirty: true },
                  );
                }}
              />
            )}
          </div>
          <div className="space-y-4">
            <Radio className="items-center" name="type" value="remote" control={control}>
              <span className="text-xl font-bold">Remote location</span>
            </Radio>
            {type === 'remote' && <RemoteFieldSet name="remote" control={control} />}
          </div>
        </div>
        <SurveyStepControls />
      </form>
    </article>
  );
}

ProgramLocation.propTypes = {
  program: PropTypes.shape({
    id: PropTypes.string.isRequired,
    inPerson: PropTypes.shape({ available: PropTypes.bool.isRequired }),
    locations: PropTypes.array,
    remote: PropTypes.shape({
      available: PropTypes.bool.isRequired,
    }),
  }).isRequired,
};
