import { useFieldArray, useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { array, object } from 'yup';
import PropTypes from 'prop-types';
import { useUpdateProgramDraft } from '@/core/api/ProgramDraftQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { AddButton, LocationFieldSet, RemoteFieldSet } from '@/modules/program';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { Checkbox } from '@/modules/form';

const schema = object({
  locations: array().when('inPersonType', { is: true, then: array(LocationFieldSet.schema) }),
  remote: object().when('remoteType', { is: true, then: RemoteFieldSet.schema }),
});

export function MultiProgramLocation({ draft }) {
  let survey = useSurvey();
  let update = useUpdateProgramDraft();
  let { program } = draft;

  let {
    handleSubmit,
    watch,
    control,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      locations: program.locations.length > 0 ? program.locations : [{}],
      inPersonType: program?.inPerson?.available,
      remoteType: program?.remote?.available,
      remote: program?.remote ?? {},
    },
  });

  const {
    fields,
    append,
    remove,
    update: updateLocation,
  } = useFieldArray({ name: 'locations', control });

  let inPersonType = watch('inPersonType');
  let remoteType = watch('remoteType');

  async function submit(data) {
    let patch = {
      locations: [],
      inPerson: { available: false },
      remote: { available: false, voice: false, chat: false, video: false, states: [''] },
    };

    if (isDirty) {
      if (inPersonType) {
        patch.inPerson = { available: true };
        patch.locations = data.locations.map(LocationFieldSet.toApiValue);
      }
      if (remoteType) {
        patch.remote = {
          ...data.remote,
          available: true,
          states: data.remote.states.map((s) => s.code),
        };
      }

      await update({ program: patch });

      mixpanel.track('Multiple program location step');
    }
    survey.navigateNext();
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl">Where are you offering services?</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-8">
          <div className="space-y-4">
            <Checkbox className="items-center" name="inPersonType" control={control}>
              <span className="text-xl font-bold">In-person location</span>
            </Checkbox>
            {inPersonType && (
              <>
                <p>If you have multiple locations, please list them all.</p>
                <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="-mx-4 space-y-8 px-4 py-6 first:pt-0 last:pb-0 md:mx-0 md:px-0"
                    >
                      <LocationFieldSet
                        mode="PROGRAM"
                        removable={fields.length > 1}
                        onRemove={() => remove(index)}
                        onClear={() =>
                          updateLocation(index, {
                            ...field.value,
                            ...LocationFieldSet.defaultLocation,
                          })
                        }
                        name={`locations.${index}`}
                        control={control}
                      />
                      {index === fields.length - 1 && (
                        <AddButton onClick={() => append(LocationFieldSet.defaultLocation)}>
                          Add another in-person location
                        </AddButton>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="space-y-4">
            <Checkbox className="items-center" name="remoteType" control={control}>
              <span className="text-xl font-bold">Remote location</span>
            </Checkbox>
            {remoteType && <RemoteFieldSet name="remote" control={control} />}
          </div>
        </div>
        <SurveyStepControls disabled={!inPersonType && !remoteType} />
      </form>
    </article>
  );
}

MultiProgramLocation.propTypes = {
  draft: PropTypes.object,
};
