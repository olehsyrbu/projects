import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { object, string } from 'yup';
import { logger } from '@/core/logger';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import mixpanel from '@/core/mixpanel';
import { usePersonOnBoarding } from '../hooks';
import { getOboadringText } from '../utils';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { PhotoPicker, TextArea } from '@/modules/form';

const schema = object({
  tagLine: string().required('This field is required'),
  photoUrl: string().nullable().required('This field is required'),
});

export function OnboardingProviderPhoto() {
  let survey = useSurvey();
  const { provider, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });

  let {
    handleSubmit,
    watch,
    control,
    formState: { isDirty, dirtyFields, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      photoUrl: provider?.photoUrl,
      tagLine: provider?.tagLine,
    },
  });

  async function submit(data) {
    try {
      if (isDirty) {
        const { photoUrl, ...newProfile } = data;

        if (dirtyFields.photoUrl) newProfile.photoUrl = photoUrl;
        await updateProvider(newProfile);
        mixpanel.track('Step 8 submitted');
      }
      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  const tagLineText = watch('tagLine');

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>{texts.title}</h1>
      <div className="mb-8 box-border flex max-w-max items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
        <Info className="text-p-75" />
        <p className="flex-1">{texts.subTitle}</p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="mb-4">
          <PhotoPicker control={control} name="photoUrl" />
        </div>
        <div>
          <p className="font-bold">Tagline</p>
          <p className="pb-4">{texts.textTagLine}</p>
          <TextArea
            name="tagLine"
            maxLength={154}
            control={control}
            value={tagLineText}
            placeholder="Example: I welcome and affirm clients of all identities and backgrounds in my practice."
          />
        </div>
        <SurveyStepControls disabled={isSubmitting && !isValid} />
      </form>
    </article>
  );
}
