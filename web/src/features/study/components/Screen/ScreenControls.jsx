import { noop } from '@/core/utils';
import { useNavigate } from 'react-router-dom';
import { SurveyStepControls } from '@/modules/survey/components';
import { useAppletContext } from '@/modules/mindlogger/hooks';

export function ScreenControls({ ...props }) {
  const navigate = useNavigate();
  const { screens, screenStep, activityStep, activities, loading } = useAppletContext();

  function getButtonLabel() {
    const lastStep = screenStep === screens.length;
    const nextButtonLabel = `Next ${lastStep ? 'survey' : ''}`;
    return activities.length === activityStep && lastStep ? 'Finish' : nextButtonLabel;
  }

  return (
    <SurveyStepControls
      {...props}
      handleBack={() => {
        props.handleSave();
        navigate(-1);
      }}
      nextButtonLabel={getButtonLabel()}
      hasChevrons={false}
      hasEnterPrompt={false}
      loading={loading}
      onNext={noop}
      hasBackControl={screenStep > 1}
    />
  );
}
