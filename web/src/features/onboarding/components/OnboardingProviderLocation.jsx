import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { array, bool, object } from 'yup';
import mixpanel from '@/core/mixpanel';
import { Alert } from '@/core/components';
import { Warning16Regular as Warning } from '@fluentui/react-icons';
import { logger } from '@/core/logger';
import { Checkbox } from '@/modules/form';
import { useSurvey } from '@/modules/survey/hooks';
import {
  AccommodationsFieldSet,
  AddButton,
  LocationFieldSet,
  RemoteFieldSet,
} from '@/modules/program';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { Details, Summary } from '@/features/guided-search/components/Details';
import { usePersonOnBoarding } from '../hooks';
import { getIsRoleProvider, getOboadringText } from '../utils';

const schema = object({
  status: bool().when(['inPersonType', 'remoteType'], {
    is: (inPersonType, remoteType) => !inPersonType && !remoteType,
    then: (schema) => schema.required('Please select at least one location'),
  }),
  locations: array().when('inPersonType', { is: true, then: array(LocationFieldSet.schema) }),
  remote: object().when('remoteType', { is: true, then: RemoteFieldSet.providerSchema }),
});

export function OnboardingProviderLocation() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });
  const { locations, inPerson, remote } = provider;

  let {
    handleSubmit,
    watch,
    control,
    formState: { isDirty, errors, isSubmitted, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      inPersonType: inPerson?.available,
      remoteType: remote?.available,
      locations: locations.length > 0 ? locations : [{}],
      accommodations: locations.map((loc) => loc.accommodations?.map(({ id }) => id) ?? []),
      remote: remote || {},
    },
  });
  let inPersonType = watch('inPersonType');
  let remoteType = watch('remoteType');

  const {
    fields,
    append,
    remove,
    update: updateLocation,
  } = useFieldArray({ name: 'locations', control });

  async function submit(data) {
    let newProvider = {
      locations: [],
      inPerson: { available: false },
      remote: { available: false, voice: false, chat: false, video: false },
    };

    try {
      if (isDirty) {
        const { accommodations, locations, remote } = data;

        if (inPersonType) {
          newProvider.inPerson = { available: true };
          newProvider.locations = locations.map((location, index) => ({
            ...LocationFieldSet.toApiValue(location),
            accommodations: accommodations[index],
          }));
        }

        if (remoteType) {
          newProvider.remote = {
            ...remote,
            available: true,
          };
        }

        updateProvider(newProvider);
        mixpanel.track('Step 2 submitted');
      }
      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <p className="mb-8 text-2xl font-bold">
        {getIsRoleProvider(role)
          ? `Hi ${provider.preferredFirstName || provider.legalFirstName}! ${texts.title}`
          : texts.title}
      </p>
      {errors.status && !inPersonType && !remoteType && (
        <Alert
          className="mb-4 w-fit bg-warning-3"
          text={errors.status.message}
          icon={<Warning />}
        />
      )}

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <div className="space-y-4 border-b border-graphics-30 pb-6">
            <Checkbox className="items-center" name="inPersonType" control={control}>
              <span className="text-xl font-bold">In-person location</span>
            </Checkbox>
            {inPersonType && (
              <>
                <p>If you have multiple locations you can add them later</p>
                <div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="-mx-4 space-y-8 px-4 pt-8 first:pt-0 md:mx-0 md:px-0"
                    >
                      <LocationFieldSet
                        mode="PERSON"
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
                      <Details className="!mt-6">
                        <Summary className="!text-base">
                          <p className="font-bold">
                            At MiResource we believe everyone should have equal access to mental
                            health care
                          </p>
                          <p className="font-normal">{texts.textAccommodationHint}</p>
                        </Summary>
                        <AccommodationsFieldSet
                          control={control}
                          name={`accommodations.${index}`}
                          mode="PERSON"
                        />
                      </Details>
                      {index === fields.length - 1 && (
                        <AddButton
                          className="!mb-2"
                          onClick={() => append(LocationFieldSet.defaultLocation)}
                        >
                          Add another in-person location
                        </AddButton>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="!mt-0 space-y-4 border-b border-graphics-30 pb-6">
            <Checkbox className="mt-6 items-center" name="remoteType" control={control}>
              <span className="text-xl font-bold">Remote location</span>
            </Checkbox>
            {remoteType && <RemoteFieldSet providerMode name="remote" control={control} />}
          </div>
        </div>
        <SurveyStepControls disabled={isSubmitted && !isValid} />
      </form>
    </article>
  );
}
