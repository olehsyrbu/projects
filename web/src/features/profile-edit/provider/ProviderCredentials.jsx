import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { array, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { NumberInput } from '@/modules/form';
import { useAuthContext } from '@/modules/auth';
import {
  CertificationFieldSet,
  EducationFieldSet,
  PersonalCredentialFieldSet,
  PublicationFieldSet,
} from '@/modules/program';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';
import { RefDataSelect } from '../RefDataSelect';

const schema = object({
  providerTypes: array().min(1, 'This field is required').required('This field is required'),
  certifications: CertificationFieldSet.schema(),
  educations: EducationFieldSet.schema(),
  publications: PublicationFieldSet.schema(),
  credential: PersonalCredentialFieldSet.schema(),
});

export function ProviderCredentials({ provider }) {
  const update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      providerTypes: provider.providerTypes,
      experience: provider.experience || 0,
      certifications: CertificationFieldSet.toFormValue(provider.certifications),
      educations: EducationFieldSet.toFormValue(provider.educations),
      publications: PublicationFieldSet.toFormValue(provider.publications),
      credential: PersonalCredentialFieldSet.toFormValue({ provider }),
    },
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    if (isDirty) {
      let { providerTypes, experience, certifications, educations, publications, credential } =
        values;
      const { licenses, noLicense } = PersonalCredentialFieldSet.toValueApi(credential);
      const newProfile = {
        providerTypes,
        licenses,
        noLicense,
        experience: 0,
      };

      newProfile.certifications = CertificationFieldSet.toValueApi(certifications);
      newProfile.educations = EducationFieldSet.toValueApi(educations);
      newProfile.publications = PublicationFieldSet.toValueApi(publications);

      if (experience) {
        newProfile.experience = +experience;
      }

      await update(provider.id, newProfile, user);
      reset(getValues());
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col  divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div className="pb-6">
          <h3 className="mb-4 flex items-center gap-x-2 text-base">Types of provider</h3>
          <RefDataSelect
            mode="PERSON"
            type="ProviderType"
            name="providerTypes"
            label="Types of provider"
            control={control}
          />
        </div>
        <div className="pt-6">
          <h3 className="text-base">License(s) information</h3>
          <PersonalCredentialFieldSet name="credential" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <h3 className="text-base">
            Years of experience <span className="font-normal">(optional)</span>
          </h3>
          <NumberInput
            className="md:w-60"
            inputClassName="!text-left"
            name="experience"
            control={control}
            min="0"
            max="100"
          />
        </div>
        <div className="space-y-4 py-6">
          <h3 className="text-base">
            Certification(s) / specialized training
            <span className="font-normal"> (optional)</span>
          </h3>
          <CertificationFieldSet name="certifications" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <h3 className="text-base">
            Education(s)
            <span className="font-normal"> (optional)</span>
          </h3>
          <EducationFieldSet name="educations" control={control} />
        </div>
        <div className="space-y-4 py-6">
          <h3 className="text-base">
            Publication(s)
            <span className="font-normal"> (optional)</span>
          </h3>
          <PublicationFieldSet control={control} name="publications" />
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

ProviderCredentials.propTypes = {
  provider: PropTypes.object,
};
