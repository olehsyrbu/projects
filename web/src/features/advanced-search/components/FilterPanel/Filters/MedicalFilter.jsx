import PropTypes from 'prop-types';
import { TooltipIcon } from '@/core/components/Tooltip';
import { CheckboxController } from './FilterControllers';

export function MedicalFilter({
  treatsMedicallyUnstable,
  treatsSuicidalIdeation,
  canAssistWithDailyLiving,
  dataKey,
  onAfterChange,
  ...rest
}) {
  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  return (
    <div className="flex flex-col space-y-4">
      <CheckboxController
        name="treatsMedicallyUnstable"
        defaultValue={treatsMedicallyUnstable}
        onAfterChange={handleAfterChange}
        id="treatsMedicallyUnstableFilter"
        {...rest}
      >
        Medically unstable
      </CheckboxController>
      <CheckboxController
        name="treatsSuicidalIdeation"
        defaultValue={treatsSuicidalIdeation}
        onAfterChange={handleAfterChange}
        id="treatsSuicidalIdeationFilter"
        {...rest}
      >
        Actively suicidal
      </CheckboxController>

      <div className="flex items-center space-x-2">
        <CheckboxController
          name="canAssistWithDailyLiving"
          defaultValue={canAssistWithDailyLiving}
          onAfterChange={handleAfterChange}
          id="canAssistWithDailyLivingFilter"
          {...rest}
        >
          Help with activities of daily living
        </CheckboxController>
        <TooltipIcon label="Activities of daily living refer to tasks of everyday life, such as eating, dressing, getting into or out of a bed or chair, taking a bath or shower, and using the toilet. If you need help with these activities we can find programs that offer it." />
      </div>
    </div>
  );
}

MedicalFilter.propTypes = {
  treatsMedicallyUnstable: PropTypes.bool,
  treatsSuicidalIdeation: PropTypes.bool,
  canAssistWithDailyLiving: PropTypes.bool,
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
};
