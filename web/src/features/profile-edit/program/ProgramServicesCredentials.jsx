import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useReferenceData } from '@/modules/reference-data';
import { logger } from '@/core/logger';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { ReferenceDataSelect as ReferenceDataSelectController, Warning } from '@/modules/form';
import { CertificationFieldSet, CredentialsFieldSet } from '@/modules/program';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { TooltipIcon } from '@/core/components/Tooltip';

//TODO MIR-4211 move all utils function to folder utils
let ids = (refdata) => refdata?.map(({ id }) => id) ?? refdata;
let codes = (refdata) => refdata?.map(({ code }) => code) ?? refdata;

const schema = object().shape({
  credentials: CredentialsFieldSet.schema(),
  certifications: CertificationFieldSet.schema(),
});

export function ProgramServicesCredentials({ program }) {
  const update = useUpdateProgram();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isDirty, dirtyFields, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      credentials: CredentialsFieldSet.toFormValue({ program }),
      certifications: CertificationFieldSet.toFormValue(program.certifications),
      providerTypes: program.providerTypes.map(({ providerType }) => providerType) ?? [],
      therapyTypes: program.therapyTypes ?? [],
      services: program.services ?? [],
      languageServices: program.languageServices ?? [],
      treatmentTypes: program.treatmentTypes ?? [],
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  async function submit(values) {
    const {
      credentials,
      certifications,
      languageServices,
      providerTypes,
      treatmentTypes,
      therapyTypes,
      services,
    } = values;

    if (isDirty) {
      let patch = {
        languageServices: ids(languageServices),
        providerTypes: ids(providerTypes),
        treatmentTypes: ids(treatmentTypes),
        therapyTypes: ids(therapyTypes),
        services: codes(services),
        ...CredentialsFieldSet.toValueApi([credentials]),
      };

      if (dirtyFields.certifications) {
        if (CertificationFieldSet.isEmpty(certifications)) {
          patch.certifications = [];
        } else {
          patch.certifications = CertificationFieldSet.toValueApi(certifications);
        }
      }

      try {
        const response = await update(program.id, patch);

        reset({
          ...getValues(),
          certifications: CertificationFieldSet.toFormValue(certifications),
          credentials: CredentialsFieldSet.toFormValue({ program: response }),
        });
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <article>
          <h3 className="mb-4 flex items-center gap-x-2 text-base font-bold">
            Type of providers on staff
            <span className="font-normal"> (optional)</span>
            <TooltipIcon label="Specifies providers' education, licensing, or accreditation" />
          </h3>
          <ReferenceDataSelect
            control={control}
            type="ProviderType"
            name="providerTypes"
            label="Select all that apply"
            isMulti
          />
        </article>
        <article>
          <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
            Therapeutic modalities
            <span className="font-normal"> (optional)</span>
            <TooltipIcon label="Describes the format for how treatments and services are offered." />
          </h3>
          <ReferenceDataSelect
            type="Therapy"
            control={control}
            name="therapyTypes"
            label="Select all that apply"
            isMulti
          />
        </article>
        <article>
          <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
            Services
            <span className="font-normal"> (optional)</span>
            <TooltipIcon label="Supportive interventions that enhance the treatment experience." />
          </h3>
          <ReferenceDataSelect
            type="Service"
            control={control}
            name="services"
            label="Select all that apply"
            isMulti
          />
        </article>
        <article>
          <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
            Types of treatments
            <span className="font-normal"> (optional)</span>
            <TooltipIcon label="Specifies the type of care provided." />
          </h3>
          <ReferenceDataSelect
            type="Treatment"
            control={control}
            name="treatmentTypes"
            label="Select all that apply"
            isMulti
          />
        </article>
        <article>
          <h3 className="my-4 text-base font-bold">
            Languages available <span className="font-normal"> (optional)</span>
          </h3>

          <ReferenceDataSelect
            type="LanguageService"
            control={control}
            name="languageServices"
            label="Select all that apply"
            isMulti
          />
        </article>
        <article className="space-y-4">
          <h3 className="mt-6 text-base font-bold">Accreditation/license(s) information</h3>
          <Warning
            message="credentials.status.message"
            className="mb-4 px-4 py-2"
            control={control}
          />
          <CredentialsFieldSet name="credentials" control={control} />
        </article>
        <article>
          <h3 className="my-4 flex items-center gap-x-2 text-base font-bold">
            Certification(s)<span className="font-normal"> (optional)</span>
            <TooltipIcon label="A credential that demonstrates your program specializes in a particular treatment area" />
          </h3>
          <CertificationFieldSet name="certifications" control={control} />
        </article>
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

ProgramServicesCredentials.propTypes = {
  program: PropTypes.object.isRequired,
};

function ReferenceDataSelect({ type, ...props }) {
  let options = useReferenceData(type, { types: ['PROGRAM'] });
  return (
    <ReferenceDataSelectController
      className="max-w-md"
      {...props}
      options={options}
      isSearchable={false}
    />
  );
}

ReferenceDataSelect.propTypes = {
  type: PropTypes.string,
};
