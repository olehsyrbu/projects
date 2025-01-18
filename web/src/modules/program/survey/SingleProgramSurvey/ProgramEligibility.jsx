import { FormProvider, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { array, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { pick } from 'lodash-es';
import { useReferenceData } from '@/modules/reference-data';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { Checkbox, ReferenceDataSelect } from '@/modules/form';
import { Details, Summary } from '@/features/guided-search/components/Details';
import mixpanel from '@/core/mixpanel';

let ids = (refdata) => refdata?.map(({ id }) => id) ?? refdata;
let codes = (refdata) => refdata?.map(({ code }) => code) ?? refdata;

export function ProgramEligibility({ program }) {
  let survey = useSurvey();
  let form = useForm({
    resolver: yupResolver(
      object({
        requiredTherapeuticAreas: array()
          .min(1, 'Select at least one therapeutic area')
          .required('Select at least one therapeutic area'),
        ageGroups: array()
          .min(1, 'Select at least one age group')
          .required('Select at least one age group'),
      }),
    ),
    defaultValues: pick(program, [
      'requiredTherapeuticAreas',
      'matchesAllConditionsFrom',
      'excludedTherapeuticAreas',
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
  });
  let updateProgram = useUpdateProgram();

  let requiredAreas = form.watch('requiredTherapeuticAreas');
  let { isSubmitted } = form.formState;

  async function submit(data) {
    await updateProgram(program.id, {
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

    mixpanel.track('Single program eligibility step');

    survey.navigateNext();
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">Let's start with program eligibility</h1>
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
          <div>
            <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
              Clients/patients must be struggling with these conditions to be eligible
            </h3>
            <RefdataSelect
              type="TherapeuticArea"
              name="requiredTherapeuticAreas"
              className="max-w-md"
              label="Therapeutic areas"
              onChange={(values) => {
                form.setValue('requiredTherapeuticAreas', values, { shouldValidate: isSubmitted });

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
            >
              Client/Patient has to match all required conditions
            </Checkbox>
          </div>
          <div>
            <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
              These conditions exclude the clients/patients from participating{' '}
              <span className="font-normal">(optional)</span>
            </h3>
            <RefdataSelect
              type="TherapeuticArea"
              name="excludedTherapeuticAreas"
              className="max-w-md"
              label="Therapeutic areas"
              excluded={requiredAreas}
            />
          </div>
          <div>
            <h3 className="mb-4 mt-6 text-base font-bold">Which age groups are eligible?</h3>
            <RefdataSelect
              type="AgeGroup"
              name="ageGroups"
              className="max-w-md"
              label="Age groups"
              sorted={false}
              sort={{ order: 'ASC' }}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold">The program accepts clients/patients:</h3>
            <div className="flex flex-col space-y-3">
              <Checkbox name="treatsMedicallyUnstable">who are not medically stable</Checkbox>
              <Checkbox name="canAssistWithDailyLiving">
                who need assistance with activities of daily living
              </Checkbox>
              <Checkbox name="treatsSuicidalIdeation">who are actively suicidal</Checkbox>
            </div>
          </div>
          <Details>
            <Summary className="!text-base">
              Other audience characteristics <span className="font-normal">(optional)</span>
            </Summary>
            <div className="[&>*]:max-w-md [&>p]:my-4 [&>p]:text-base [&>p]:font-bold">
              <p>Gender-focused:</p>
              <RefdataSelect type="Gender" name="genders" />

              <p>Ethnic identity-based:</p>
              <RefdataSelect type="Ethnicity" name="ethnicities" />

              <p>Sexual identity-based:</p>
              <RefdataSelect type="SexualIdentityBased" name="sexualIdentities" />

              <p>Faith-based:</p>
              <RefdataSelect type="Religion" name="religions" />

              <p>Experience supporting groups:</p>
              <RefdataSelect type="SpecialGroup" name="specialGroups" />
            </div>
          </Details>
          <SurveyStepControls />
        </form>
      </FormProvider>
    </article>
  );
}

ProgramEligibility.propTypes = {
  program: PropTypes.object.isRequired,
};

function RefdataSelect({ type, excluded, sort, ...rest }) {
  const excludedIds = new Set(excluded?.map((i) => i.id));
  const options = useReferenceData(type, { types: ['PROGRAM'] }, sort);
  const filtered = options.filter((option) => !excludedIds.has(option.id));

  return (
    <ReferenceDataSelect
      label="Select all that apply"
      isSearchable={false}
      isMulti
      {...rest}
      options={filtered}
    />
  );
}

RefdataSelect.propTypes = {
  type: PropTypes.string.isRequired,
  excluded: PropTypes.array,
  sort: PropTypes.object,
};
