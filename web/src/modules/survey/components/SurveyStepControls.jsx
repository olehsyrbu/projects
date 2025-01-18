import { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronLeft24Filled as ChevronLeft,
  ChevronRight24Filled as ChevronRight,
  ArrowEnterLeft24Filled as ArrowEnterLeft,
} from '@fluentui/react-icons';
import { noop } from '@/core/utils';
import { useEventListener } from '@/core/hooks';
import { useSurvey } from '../hooks';

export let SurveyStepControls = forwardRef((props, ref) => {
  let survey = useSurvey();

  let nextButtonRef = useRef();

  let {
    nextButtonLabel,
    backButtonLabel,
    handleBack,
    disabled,
    onNext,
    hasChevrons,
    hasBackControl,
    hasEnterPrompt,
    loading,
  } = props;

  useEventListener(window, 'keydown', (event) => {
    if (event.code === 'Enter' && event.target === document.body) {
      nextButtonRef.current.click();
    }
  });

  return (
    <>
      <div className="flex-1" />
      <div
        ref={ref}
        className="sticky bottom-0 -mx-4 !mt-10 flex bg-surface px-4 py-2 shadow-[0_-3px_10px_rgba(0,0,0,0.06)] md:static md:mx-0 md:bg-transparent md:p-0 md:shadow-none"
      >
        {hasBackControl && (
          <button
            type="button"
            className="mir-button compact !mr-2 !h-12 md:!mr-3"
            onClick={handleBack || survey?.navigatePrev}
          >
            {hasChevrons && <ChevronLeft />}
            <span>{backButtonLabel}</span>
          </button>
        )}
        <button
          ref={nextButtonRef}
          className="mir-button compact primary !h-12 flex-1 md:!w-48 md:flex-none"
          disabled={disabled || loading}
          onClick={onNext}
        >
          {loading ? (
            <div className="flex items-center">
              <Spinner className="mr-2 animate-spin text-white" /> Loading
            </div>
          ) : (
            <span>{nextButtonLabel}</span>
          )}

          {hasChevrons && <ChevronRight />}
        </button>
        {hasEnterPrompt && (
          <span className="ml-6 hidden items-center justify-center whitespace-nowrap font-medium leading-relaxed text-p-40 md:flex">
            Press Enter
            <ArrowEnterLeft className="ml-1" />
          </span>
        )}
      </div>
    </>
  );
});

function Spinner(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={24}
      height={24}
    >
      <path d="M12.5 1.65c0-.911-.742-1.662-1.645-1.537A12 12 0 1 0 23.08 17.662c.43-.804-.017-1.76-.872-2.076-.855-.316-1.792.133-2.263.913a8.7 8.7 0 0 1-14.584.474A8.7 8.7 0 0 1 10.86 3.457c.896-.172 1.641-.895 1.641-1.807Z" />
    </svg>
  );
}

SurveyStepControls.propTypes = {
  nextButtonLabel: PropTypes.string,
  backButtonLabel: PropTypes.string,
  handleBack: PropTypes.func,
  disabled: PropTypes.bool,
  onNext: PropTypes.func,
  hasChevrons: PropTypes.bool,
  hasBackControl: PropTypes.bool,
  hasEnterPrompt: PropTypes.bool,
  loading: PropTypes.bool,
};

SurveyStepControls.defaultProps = {
  nextButtonLabel: 'Next',
  backButtonLabel: 'Back',
  disabled: false,
  hasChevrons: true,
  hasBackControl: true,
  onNext: noop,
  hasEnterPrompt: true,
  loading: false,
};
