import { useForm } from 'react-hook-form';
import { array, object } from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { TooltipIcon } from '@/core/components/Tooltip';
import { useAuthContext } from '@/modules/auth';
import { Checkbox, Switch } from '@/modules/form';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';
import { RefDataSelect } from '../RefDataSelect';

const schema = object().shape({
  therapeuticAreas: array().min(1, 'This field is required').required('This field is required'),
  ageGroups: array().min(1, 'This field is required').required('This field is required'),
});

export function ProviderSpecialty({ provider }) {
  const update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    getValues,
    formState: { isDirty, isSubmitting, isSubmitted },
    reset,
  } = useForm({
    defaultValues: {
      therapeuticAreas: provider?.therapeuticAreas,
      excludedTherapeuticAreas: provider.excludedTherapeuticAreas,
      therapyTypes: provider.therapyTypes,
      treatmentTypes: provider.treatmentTypes,
      canPrescribeMedication: provider?.canPrescribeMedication,
      languageServices: provider.languageServices,
      ageGroups: provider?.ageGroups,
      specialGroups: provider.specialGroups,
      treatsMedicallyUnstable: provider.treatsMedicallyUnstable,
      canAssistWithDailyLiving: provider.canAssistWithDailyLiving,
      treatsSuicidalIdeation: provider.treatsSuicidalIdeation,
    },
    resolver: yupResolver(schema),
  });

  async function submit(data) {
    if (isDirty) {
      await update(provider.id, data, user);
      reset(getValues());
    }
  }

  let requiredAreas = watch('therapeuticAreas');

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div>
          <h3 className="mb-4 flex items-center gap-x-2 text-base">
            Areas of expertise
            <Tooltip label="Please select all the areas you are competent to practice." />
          </h3>
          <RefDataSelect
            mode="PERSON"
            type="TherapeuticArea"
            name="therapeuticAreas"
            label="Areas of expertise"
            control={control}
            onChange={(values) => {
              setValue('therapeuticAreas', values, {
                shouldValidate: isSubmitted,
                shouldDirty: true,
              });

              let ids = new Set(values.map((v) => v.id));
              let excludedAreas = getValues('excludedTherapeuticAreas');

              setValue(
                'excludedTherapeuticAreas',
                excludedAreas.filter((area) => !ids.has(area.id)),
              );
            }}
          />
        </div>
        <div className="flex flex-col space-y-4 pt-6">
          <Checkbox name="treatsSuicidalIdeation" control={control}>
            <span className="font-bold">I accept clients/patients who are actively suicidal</span>
          </Checkbox>
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">
            Excluded conditions
            <span className="font-normal"> (optional)</span>
            <Tooltip label="List any conditions you don’t feel comfortable treating. It will only help us make sure we don’t refer clients to you that you do not feel comfortable treating or would prefer not to treat. " />
          </h3>
          <RefDataSelect
            mode="PERSON"
            className="max-w-md"
            type="TherapeuticArea"
            name="excludedTherapeuticAreas"
            label="Excluded conditions"
            control={control}
            excluded={requiredAreas}
          />
          <div className="mt-4">This information will not be displayed on your profile.</div>
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">
            Types of therapeutic modalities
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect
            mode="PERSON"
            type="Therapy"
            name="therapyTypes"
            label="Therapeutic modalities"
            control={control}
          />
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">
            Types of treatments
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect
            mode="PERSON"
            type="Treatment"
            name="treatmentTypes"
            label="Types of treatments"
            control={control}
          />
        </div>
        <div>
          <Switch className="mt-6 font-bold" name="canPrescribeMedication" control={control}>
            I prescribe medication
          </Switch>
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">
            Languages available for services
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect
            mode="PERSON"
            type="LanguageService"
            name="languageServices"
            label="Languages available for services"
            control={control}
          />
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">Age groups</h3>
          <RefDataSelect
            mode="PERSON"
            type="AgeGroup"
            name="ageGroups"
            label="Age groups"
            sorted={false}
            control={control}
            sort={{ order: 'ASC' }}
          />
        </div>
        <div>
          <h3 className="my-4 flex items-center gap-x-2 text-base">
            Special groups
            <span className="font-normal"> (optional)</span>
            <Tooltip label="Select groups you have an allyship or experience supporting." />
          </h3>
          <RefDataSelect
            mode="PERSON"
            type="SpecialGroup"
            name="specialGroups"
            label="Special groups"
            control={control}
          />
        </div>
      </form>
      <EditorActions
        isDisabled={!isDirty}
        isLoading={isSubmitting}
        onSave={handleSubmit(submit)}
        onCancel={() => reset()}
      />
    </>
  );
}

function Tooltip({ label }) {
  return <TooltipIcon place="top" size="20" label={label} />;
}

Tooltip.propTypes = {
  label: PropTypes.string,
};

ProviderSpecialty.propTypes = {
  provider: PropTypes.object,
};
