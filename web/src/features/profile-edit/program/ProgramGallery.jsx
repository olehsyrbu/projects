import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useUpdateProgramLocationPhotos } from '@/core/api/ProgramQueries';
import { logger } from '@/core/logger';
import { PhotoPickerFieldSet } from '@/modules/program';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';

export function ProgramGallery({ program }) {
  let update = useUpdateProgramLocationPhotos();
  let location = program.locations[0] || { photos: [] };

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      photos: location.photos?.map(({ url }) => url) ?? [],
    },
    resolver: yupResolver(PhotoPickerFieldSet.schema),
  });

  async function submit({ photos }) {
    try {
      if (isDirty) {
        const { locations: newLocations } = await update({
          program,
          locationId: location.id,
          photos,
        });

        reset({ photos: newLocations[0].photos?.map(({ url }) => url) });
      }
    } catch (err) {
      logger.error(err);
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-70"
      >
        <article>
          <h3 className="text-base font-bold">Gallery of photos</h3>
          <p className="my-6 md:w-[34rem]">
            We have found that prospective clients/patients are 90% more likely to reach out if you
            have photos. You can always add more later.
          </p>
          <PhotoPickerFieldSet name={`photos`} control={control} />
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

ProgramGallery.propTypes = {
  program: PropTypes.object,
};
