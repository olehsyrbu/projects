import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { array, object } from 'yup';
import mixpanel from '@/core/mixpanel';
import { logger } from '@/core/logger';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useUpdateProgramDraftLocationPhotos } from '@/core/api/ProgramDraftQueries';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { InlineAddress, PhotoPickerFieldSet } from '@/modules/program';
import { Details, Summary } from '@/features/guided-search/components/Details';
import { Warning } from '@/modules/form';

const schema = object({
  locations: array().of(PhotoPickerFieldSet.schema),
});

export function MultiProgramPhotos({ draft }) {
  let survey = useSurvey();
  let update = useUpdateProgramDraftLocationPhotos();
  let program = draft?.program;
  let locations = program?.locations || [];

  let {
    handleSubmit,
    formState: { isDirty, isSubmitting },
    control,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      locations: locations.map(({ id, address, photos }) => ({
        id,
        address,
        photos: photos.map((p) => p.url),
      })),
    },
  });

  async function submit(values) {
    try {
      if (isDirty) {
        await update(values.locations);

        mixpanel.track('Multiple program photos step');
      }

      survey.navigateNext();
    } catch (err) {
      logger.error(err);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="space-y-2 font-sans !text-2xl">
        <span>Add photos for your locations</span>
      </h1>
      <div className="mb-2 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
        <Info className="text-p-75" />
        <p className="flex-1">
          We have found that prospective clients/patients are 90% more likely to reach out if you
          have photos. You can always add more later.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        {locations.map(({ address, id }, index) => {
          return (
            <Details open={index === 0} key={index} className={index === 0 && 'border-t-0'}>
              <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
                <div className="flex flex-col md:flex-row">
                  <InlineAddress {...address} className="flex h-10  items-center" />
                  <Warning
                    message={`locations[${[index]}].photos.message`}
                    className="mt-4 bg-warning-3 px-4 py-2 md:ml-4 md:mt-0"
                    control={control}
                  />
                </div>
              </Summary>
              <PhotoPickerFieldSet
                className="mb-10 pl-0 md:pl-10"
                title="Gallery photos"
                name={`locations.${index}.photos`}
                control={control}
              />
            </Details>
          );
        })}
        <SurveyStepControls disabled={isSubmitting} />
      </form>
    </article>
  );
}

MultiProgramPhotos.propTypes = {
  draft: PropTypes.object,
};
