import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { isUndefined } from 'lodash-es';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Info24Regular as Info } from '@fluentui/react-icons';

import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { Tooltip } from '@/core/components/Tooltip';
import { PhotoPicker, Switch, TextArea, TextField } from '@/modules/form';
import { useAuthContext } from '@/modules/auth';
import { useOrganization } from '@/modules/organization';
import { ClearButton } from '@/modules/program/components';
import { RefDataSelect } from './RefDataSelect';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';

const schema = object().shape({
  legalFirstName: string().required('This field is required'),
  legalLastName: string().required('This field is required'),
  tagLine: string().required('This field is required'),
  photoUrl: string().required('This field is required'),
  website: string()
    .url('Please enter a valid URL. Example: https://miresource.com/')
    .optional()
    .nullable(),
  nationalProviderIdentifier: string()
    .test('is-required-check', 'This field is required', (value) => value !== '')
    .matches(/^\d{10}$/, {
      message: '10-digit number format is required',
      excludeEmptyString: true,
    }),
});

export function ProviderGeneral({ provider }) {
  let update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  let organization = useOrganization();

  let {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isDirty, dirtyFields, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      legalFirstName: provider?.legalFirstName,
      legalLastName: provider?.legalLastName,
      preferredFirstName: provider?.preferredFirstName,
      photoUrl: provider?.photoUrl,
      pronoun: provider?.pronoun,
      nationalProviderIdentifier: provider?.nationalProviderIdentifier,
      tagLine: provider?.tagLine,
      description: provider?.description,
      website: provider?.website,
      genders: provider?.genders,
      sexualIdentities: provider?.sexualIdentities,
      rainbowMember: provider?.rainbowMember,
      ethnicities: provider?.ethnicities || [],
      religions: provider?.religions || [],
    },
    resolver: yupResolver(schema),
  });

  const tagLineText = watch('tagLine');
  const descriptionText = watch('description');

  async function submit(values) {
    if (isDirty) {
      const { photoUrl, ...rest } = values;
      const newProfile = {
        ...rest,
        website: values.website || null,
        pronoun: (values.pronoun && values.pronoun.id) || null,
      };

      if (dirtyFields.photoUrl) newProfile.photoUrl = photoUrl;

      await update(provider.id, newProfile, user);
      reset(values);
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div className="grid md:grid-cols-3">
          <div className="col-span-2">
            <article className="space-y-4">
              <h3 className="mb-4 text-base">Name</h3>
              <TextField
                className="md:max-w-md"
                label="Legal First Name"
                name="legalFirstName"
                control={control}
              />
              <TextField
                className="md:max-w-md"
                label="Legal Last Name"
                name="legalLastName"
                control={control}
              />
              <TextField
                className="md:max-w-md"
                label="Preferred First Name (optional)"
                name="preferredFirstName"
                control={control}
              />
            </article>
          </div>
          <div className="col-start-1 col-end-3 row-start-1 mb-4 md:col-start-3 md:row-start-1 md:mb-0">
            <PhotoPicker control={control} name="photoUrl" viewByCenter />
          </div>
        </div>
        <div>
          <h3 className="my-4 text-base">
            Pronouns <span className="font-normal">(optional)</span>
          </h3>

          <div className="flex flex-col gap-4 md:mx-0 md:flex-row">
            <RefDataSelect
              type="Pronoun"
              name="pronoun"
              className="sm:!w-64"
              isMulti={false}
              label="Select"
              control={control}
            />
            <ClearButton onClick={() => setValue('pronoun', null, { shouldDirty: true })} />
          </div>
        </div>
        {!isUndefined(provider?.nationalProviderIdentifier) && (
          <div>
            <div className="mb-4 mt-6 flex items-center space-x-2">
              <h3 className="text-base">National Provider Identifier (NPI)</h3>
              <Tooltip
                label={
                  organization?.subdomain === 'bcbsks'
                    ? "The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won't be publicly displayed. Blue Cross Blue Shield will use it to determine eligibility for their Quality Based Reimbursement Program (QBRP)."
                    : 'The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won’t be publicly displayed.'
                }
                place="right"
                className="max-w-sm"
              >
                <Info className="text-p-100" />
              </Tooltip>
            </div>
            <TextField
              className="sm:!w-64"
              label="Number"
              name="nationalProviderIdentifier"
              maxLength={10}
              inputMode="numeric"
              control={control}
            />
          </div>
        )}
        <div>
          <h3 className="mb-1 mt-4 text-base">Tagline</h3>
          <div className="mb-4">
            A short introduction to your practice that will be displayed next to your name in search
            results.
          </div>
          <TextArea
            name="tagLine"
            maxLength={154}
            control={control}
            value={tagLineText}
            placeholder="Example: I welcome and affirm clients of all identities and backgrounds in my practice."
          />
        </div>
        <div>
          <h3 className="mb-1 mt-4 text-base">
            Description <span className="font-normal">(optional)</span>
          </h3>
          <div className="mb-4">
            Introduce yourself to prospective clients/patients. Share a bit about yourself and how
            you approach treatment. Let them know what makes your practice unique.
          </div>
          <TextArea
            name="description"
            maxLength={1200}
            control={control}
            value={descriptionText}
            placeholder="I am looking forward to meeting you. I have been practicing for 20 years in a range of treatment settings from intensive inpatient hospitals to my current private practice. I enjoy working with clients of all ages. I approach treatment from a strengths perspective, use evidence-based strategies, and will work with you to collaboratively set goals to meet your individual needs. Clients of all backgrounds and identities are welcome in my practice."
          />
        </div>
        <div>
          <h3 className="mb-1 mt-4 text-base">
            Website <span className="font-normal"> (optional)</span>
          </h3>
          <TextField
            className="md:max-w-md"
            label="Your website"
            name="website"
            control={control}
          />
          <p className="pt-2 text-sm text-hint">Please start your URL with https://</p>
        </div>
        <div>
          <h3 className="my-4">
            Your gender identity
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect type="Gender" name="genders" control={control} />
        </div>
        <div>
          <h3 className="my-4">
            Your sexual identity
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect type="SexualIdentityBased" name="sexualIdentities" control={control} />
        </div>
        <div>
          <Switch className="mt-6 font-bold" name="rainbowMember" control={control}>
            I’m an ally of the LGBTQIA+ community
          </Switch>
        </div>
        <div>
          <h3 className="my-4">
            Your race/ethnicity
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect type="Ethnicity" name="ethnicities" control={control} />
        </div>
        <div>
          <h3 className="my-4">
            Your religion
            <span className="font-normal"> (optional)</span>
          </h3>
          <RefDataSelect type="Religion" name="religions" control={control} />
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

ProviderGeneral.propTypes = {
  provider: PropTypes.object,
};
