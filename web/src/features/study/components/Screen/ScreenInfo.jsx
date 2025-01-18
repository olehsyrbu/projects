import { useAppletContext } from '@/modules/mindlogger/hooks';

export function ScreenInfo() {
  const { screens, activityStep, activity, screenStep } = useAppletContext();

  return (
    <p className="mb-4 pl-0.5 font-bold leading-normal text-p-100">
      {`${activityStep}. ${activity?.name?.en} / `}
      <span className="font-medium text-p-75">
        Question {screenStep} of {screens.length}
      </span>
    </p>
  );
}
