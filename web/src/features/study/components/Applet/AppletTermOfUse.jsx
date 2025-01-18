import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { useState } from 'react';
import { SurveyStepControls } from '@/modules/survey/components';
import { Checkbox } from '@/core/components/Checkbox';
import { ConsentForm } from './ConsentForm.constant';
import { Markdown } from '../Screen/Markdown';

export function AppletTermOfUse({ onNext }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <article className="survey-step !max-w-4xl">
      <div className="overflow-auto rounded-2xl bg-white p-10 shadow-[0_12px_20px_rgba(0,0,0,0.05)] md:mt-10 md:max-h-[495px]">
        <Markdown className="text-lg font-normal leading-6">{ConsentForm}</Markdown>
      </div>

      <Checkbox
        className="mb-16 mt-6 !w-full md:mb-12 md:!w-fit"
        isSelected={confirm}
        onChange={setConfirm}
      >
        By clicking here, you consent to participate in this study.
      </Checkbox>

      <SurveyStepControls
        hasChevrons={false}
        hasBackControl={false}
        nextButtonLabel="Continue"
        onNext={onNext}
        hasEnterPrompt={false}
        disabled={!confirm}
      />
    </article>
  );
}

AppletTermOfUse.propTypes = {
  onNext: PropTypes.func,
};

AppletTermOfUse.defaultProps = {
  onNext: noop,
};
