import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import { PhotoPicker, ReferenceDataSelect, TextArea, TextField } from '@/modules/form';
import { useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';

const schema = object().shape({
  programType: object().required('This field is required'),
  name: string().required('This field is required'),
  center: string().required('This field is required'),
  tagLine: string().required('This field is required'),
  website: string()
    .url('Please enter a valid URL. Example: https://miresource.com/')
    .optional()
    .nullable(),
});

export function ProgramGeneral({ program }) {
  let update = useUpdateProgram();
  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, dirtyFields, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      website: program?.website,
      photoUrl: program?.photoUrl,
      programType: program.programType || '',
      name: program.name || '',
      tagLine: program.tagLine || '',
      description: program.description || '',
      center: program.center || '',
    },
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    if (isDirty) {
      const { name, center, tagLine, description, website } = values;
      const patch = {
        name,
        center,
        tagLine,
        description,
        website: website || null,
        programType: values.programType?.code,
      };

      if (dirtyFields.photoUrl) {
        patch.photoUrl = values.photoUrl;
      }

      await update(program.id, patch);
      reset(values);
    }
  }

  const tagLineText = watch('tagLine');
  const descriptionText = watch('description');

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div className="grid md:grid-cols-3">
          <div className="col-span-2">
            <article>
              <h3 className="mb-4 text-base font-bold">Program type</h3>
              <TypeSelect label="Program type" name="programType" control={control} />
            </article>
            <div>
              <article>
                <h3 className="my-4 text-base font-bold">Program name</h3>
                <TextField
                  className="md:max-w-md"
                  label="Program name"
                  name="name"
                  control={control}
                />
              </article>
              <article>
                <h3 className="my-4 text-base font-bold">Program tagline</h3>
                <TextArea
                  name="tagLine"
                  minRows={2}
                  maxRows={5}
                  maxLength={154}
                  control={control}
                  value={tagLineText}
                  placeholder="Example: We offer comprehensive alcohol and drug treatment for any level of care you may need. Support for families is available."
                />
              </article>
            </div>
          </div>
          <div className="col-start-1 col-end-3 row-start-1 mb-4 md:col-start-3 md:row-start-1 md:mb-0">
            <PhotoPicker control={control} name="photoUrl" viewByCenter />
          </div>
        </div>
        <article>
          <h3 className="mt-4 text-base font-bold">
            <b>Description</b>
            <span className="font-normal"> (optional)</span>
          </h3>
          <p className="mb-4 max-w-[35rem] leading-relaxed">
            Introduce your program to prospective clients, tell them about what they can expect and
            why they would benefit from enrolling.
          </p>
          <TextArea
            name="description"
            maxRows={7}
            minRows={5}
            maxLength={1200}
            control={control}
            value={descriptionText}
            placeholder="Example: “Our eating disorders treatment program is focused on the unique needs of the individual while providing supportive resources for the family. Our evidence-based treatment approach combines individual, group, and community interventions. Our staff are seasoned clinicians with an average of 10 years experience in eating disorder care and work collaboratively to ensure you reach new milestones in your recovery plan. We’ll be with you every step of the way."
          />
        </article>
        <article>
          <h3 className="mb-3 mt-6 font-bold">
            Website <span className="font-normal"> (optional)</span>
          </h3>
          <TextField
            className="md:max-w-md"
            label="Your website"
            name="website"
            control={control}
          />
          <p className="pt-2 text-sm text-hint">Please start your URL with https://</p>
        </article>
        <article>
          <h3 className="mb-3 mt-6 text-base font-bold">Organization name</h3>
          <TextField
            className="max-w-md"
            label="Organization name"
            name="center"
            control={control}
          />
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

ProgramGeneral.propTypes = {
  program: PropTypes.object,
};

function TypeSelect(props) {
  let types = useProgramTypes();
  return (
    <ReferenceDataSelect className="md:max-w-md" {...props} options={types} isSearchable={false} />
  );
}
