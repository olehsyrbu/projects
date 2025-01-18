import { FormProvider, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { Checkbox } from '@/modules/form';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { array, object } from 'yup';
import { pick } from 'lodash-es';
import { TooltipIcon } from '@/core/components/Tooltip';
import { RefDataSelect } from '../RefDataSelect';

let ids = (refdata) => refdata?.map(({ id }) => id) ?? refdata;
let codes = (refdata) => refdata?.map(({ code }) => code) ?? refdata;

const schema = object().shape({
  requiredTherapeuticAreas: array()
    .min(1, 'This field is required')
    .required('This field is required'),
  ageGroups: array().min(1, 'This field is required').required('This field is required'),
});

export function ProgramAudience({ program }) {
  let update = useUpdateProgram();
  const form = useForm({
    defaultValues: {
      ...pick(program, [
        'excludedTherapeuticAreas',
        'requiredTherapeuticAreas',
        'matchesAllConditionsFrom',
        'ageGroups',
        'treatsMedicallyUnstable',
        'canAssistWithDailyLiving',
        'treatsSuicidalIdeation',
        'genders',
        'ethnicities',
        'sexualIdentities',
        'religions',
        'specialGroups',
      ]),
      therapeuticAreas: program.therapeuticAreas.map(({ therapeuticArea }) => therapeuticArea),
    },
    resolver: yupResolver(schema),
  });

  let requiredAreas = form.watch('requiredTherapeuticAreas');
  let therapeuticAreas = form.watch('therapeuticAreas');

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isDirty, isSubmitting, isSubmitted },
    reset,
  } = form;

  async function submit(data) {
    if (isDirty) {
      await update(program.id, {
        therapeuticAreas: ids(data.therapeuticAreas),
        requiredTherapeuticAreas: codes(data.requiredTherapeuticAreas),
        matchesAllConditionsFrom: data.matchesAllConditionsFrom,
        excludedTherapeuticAreas: ids(data.excludedTherapeuticAreas),
        ageGroups: ids(data.ageGroups),
        treatsMedicallyUnstable: data.treatsMedicallyUnstable,
        canAssistWithDailyLiving: data.canAssistWithDailyLiving,
        treatsSuicidalIdeation: data.treatsSuicidalIdeation,
        genders: ids(data.genders),
        ethnicities: ids(data.ethnicities),
        sexualIdentities: codes(data.sexualIdentities),
        religions: ids(data.religions),
        specialGroups: ids(data.specialGroups),
      });
      reset(getValues());
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
        >
          <article>
            <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
              Required conditions
              <TooltipIcon label="Clients/Patients need to be struggling with one or more of the following to be eligible for your programs. " />
            </h3>
            <RefDataSelect
              mode="PROGRAM"
              type="TherapeuticArea"
              name="requiredTherapeuticAreas"
              className="max-w-md"
              label="Therapeutic areas"
              onChange={(values) => {
                form.setValue('requiredTherapeuticAreas', values, {
                  shouldValidate: isSubmitted,
                  shouldDirty: true,
                });

                let ids = new Set(values.map((v) => v.id));
                let excludedAreas = form.getValues('excludedTherapeuticAreas');

                form.setValue(
                  'excludedTherapeuticAreas',
                  excludedAreas.filter((area) => !ids.has(area.id)),
                );
              }}
            />
            <Checkbox
              className="pt-6"
              name="matchesAllConditionsFrom"
              value="REQUIRED_THERAPEUTIC_AREAS"
              control={control}
            >
              Client/Patient has to match all required conditions
            </Checkbox>
          </article>
          <article>
            <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
              Excluded conditions
              <span className="font-normal">(optional)</span>
              <TooltipIcon label="If a client/patient is struggling with one of more of the following, they will not be eligible to participate in your program. " />
            </h3>
            <RefDataSelect
              mode="PROGRAM"
              type="TherapeuticArea"
              name="excludedTherapeuticAreas"
              className="max-w-md"
              label="Therapeutic areas"
              excluded={requiredAreas.concat(therapeuticAreas)}
            />
          </article>
          <article>
            <h3 className="py-4 text-base font-bold">The program accepts clients/patients:</h3>
            <div className="flex flex-col space-y-4">
              <Checkbox name="treatsMedicallyUnstable" control={control}>
                who are not medically stable
              </Checkbox>
              <Checkbox name="canAssistWithDailyLiving" control={control}>
                who need assistance with activities of daily living
              </Checkbox>
              <Checkbox name="treatsSuicidalIdeation" control={control}>
                who are actively suicidal
              </Checkbox>
            </div>
          </article>
          <article>
            <h3 className="mb-4 mt-6 flex items-center gap-x-2 text-base font-bold">
              Areas of specialization
              <span className="font-normal">(optional)</span>
              <TooltipIcon label="Select the areas your program specializes in and are not considered required to be eligible for participation. For example, your anxiety disorders treatment program may specialize in serving clients/patients who have experienced trauma or who engage in self-harm." />
            </h3>
            <RefDataSelect
              mode="PROGRAM"
              type="TherapeuticArea"
              name="therapeuticAreas"
              className="max-w-md"
              label="Therapeutic areas"
              onChange={(values) => {
                form.setValue('therapeuticAreas', values, { shouldDirty: true });
                let ids = new Set(values.map((v) => v.id));
                let excludedAreas = form.getValues('excludedTherapeuticAreas');

                form.setValue(
                  'excludedTherapeuticAreas',
                  excludedAreas.filter((area) => !ids.has(area.id)),
                );
              }}
            />
          </article>
          <article>
            <h3 className="mb-4 mt-6 text-base font-bold">Age range</h3>
            <RefDataSelect
              mode="PROGRAM"
              type="AgeGroup"
              name="ageGroups"
              className="max-w-md"
              label="Age groups"
              sorted={false}
              sort={{ order: 'ASC' }}
            />
          </article>

          <article>
            <h3 className="mb-4 mt-6 flex items-center gap-x-2 text-base font-bold">
              Other audience characteristics
              <span className="font-normal">(optional)</span>
              <TooltipIcon label="Programs may specialize in supporting particular identity groups. For example, a program may be grant-based to support women of color who have experienced domestic violence. If this is the case, please note the identities specifically served by your program below." />
            </h3>

            <p className="my-4 text-base font-bold">Gender-focused:</p>
            <RefDataSelect mode="PROGRAM" type="Gender" name="genders" className="max-w-md" />

            <p className="my-4 text-base font-bold">Ethnic identity-based:</p>
            <RefDataSelect
              mode="PROGRAM"
              type="Ethnicity"
              name="ethnicities"
              className="max-w-md"
            />

            <p className="my-4 text-base font-bold">Sexual identity-based:</p>
            <RefDataSelect
              mode="PROGRAM"
              type="SexualIdentityBased"
              name="sexualIdentities"
              className="max-w-md"
            />

            <p className="my-4 text-base font-bold">Faith-based:</p>
            <RefDataSelect mode="PROGRAM" type="Religion" name="religions" className="max-w-md" />

            <p className="my-4 text-base font-bold">Experience supporting groups:</p>
            <RefDataSelect
              mode="PROGRAM"
              type="SpecialGroup"
              name="specialGroups"
              className="max-w-md"
            />

            {/*TODO: MIR-3429 enable when backend done*/}
            {/*<p className="my-4 text-base font-bold">Other eligibility criteria:</p>*/}
            {/*<TextField*/}
            {/*  className="max-w-md"*/}
            {/*  label="Write your own eligibility criteria"*/}
            {/*  name="otherEligibility"*/}
            {/*  control={control}*/}
            {/*/>*/}

            {/*{showAnotherCriteria ? (*/}
            {/*  <TextField*/}
            {/*    inputClassName="mt-6"*/}
            {/*    className="max-w-md"*/}
            {/*    label="Another Criteria"*/}
            {/*    name="anotherCriteria"*/}
            {/*    control={control}*/}
            {/*  />*/}
            {/*) : (*/}
            {/* <AddButton onClick={() => setShowAnotherCriteria(true)}>Add Another Criteria</AddButton> */}
            {/*)}*/}
          </article>
        </form>
        <EditorActions
          isDisabled={!isDirty}
          isLoading={isSubmitting}
          onSave={handleSubmit(submit)}
          onCancel={() => reset()}
        />
      </FormProvider>
    </>
  );
}

ProgramAudience.propTypes = {
  program: PropTypes.object,
};
