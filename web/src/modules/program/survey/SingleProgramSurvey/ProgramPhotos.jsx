import PropType from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { logger } from '@/core/logger';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useUpdateProgramLocationPhotos } from '@/core/api/ProgramQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { InlineAddress, PhotoPickerFieldSet } from '@/modules/program';
import mixpanel from '@/core/mixpanel';

export function ProgramPhotos({ program }) {
  let survey = useSurvey();
  let update = useUpdateProgramLocationPhotos();
  let { photos, location } = getLocationAndPhotosAsUrl(program);

  let {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
    control,
  } = useForm({
    mode: 'onChange',
    defaultValues: { photos },
    resolver: yupResolver(PhotoPickerFieldSet.schema),
  });

  async function submit({ photos }) {
    try {
      if (isDirty) {
        await update({
          program,
          locationId: location.id,
          photos,
        });

        mixpanel.track('Single program photos step');
      }

      survey.navigateNext();
    } catch (err) {
      logger.error(err);
    }
  }

  return (
    <article className="survey-step md:!max-w-4xl">
      <SurveyStepInfo />
      <h1 className="space-y-2 font-sans !text-2xl">
        <span>Add photos for your location:</span>
        <br />
        <InlineAddress className="text-xl" {...location.address} />
      </h1>
      <div className="mb-8 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
        <Info className="text-p-75" />
        <p className="flex-1">
          We have found that prospective clients/patients are 90% more likely to reach out if you
          have photos. You can always add more later.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <PhotoPickerFieldSet
          className="mb-10"
          title="Gallery photos"
          name="photos"
          control={control}
        />
        <SurveyStepControls disabled={!isValid || isSubmitting} />
      </form>
    </article>
  );
}

ProgramPhotos.propTypes = {
  program: PropType.object,
};

function getLocationAndPhotosAsUrl(program) {
  let locations = program.locations;

  let location = locations[0];

  if (!location) {
    return {
      location,
      photos: [],
    };
  }
  let photos = location.photos || [];

  return {
    location,
    photos: photos.map((photo) => photo.url),
  };
}
