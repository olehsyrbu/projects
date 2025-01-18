import PropTypes from 'prop-types';

import { SEARCH_AVAILABLE_SETTINGS, SEARCH_WORK_SETTING } from '@/modules/search/utils';
import PreferredTimeFilter from './PreferredTimeFilter';
import './AvailabilityFilter.css';
import { CheckboxController, SelectController } from '../FilterControllers';
import { TooltipIcon } from '@/core/components/Tooltip';
import { useStates } from '@/core/api/StatesQueries';

export function AvailabilityFilter(props) {
  const { register, control, dataKey, query, availableWorkSettingOptions, onAfterChange } = props;

  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  const states = useStates();
  const psypactStates = states
    .filter(({ psypact }) => psypact)
    .map(({ code }) => code)
    .join(', ');

  return (
    <div className="availability">
      <SelectController
        name="setting"
        control={control}
        defaultValue={query.setting}
        onAfterChange={handleAfterChange}
        options={availableWorkSettingOptions}
        label="Remote and in-person"
        id="settingFilter"
      />
      <div className="checkbox-tooltip-wrapper">
        <CheckboxController
          control={control}
          name="hasPsypact"
          defaultValue={query.hasPsypact}
          onAfterChange={handleAfterChange}
          id="hasPsypact"
        >
          PSYPACT Provider
        </CheckboxController>
        <TooltipIcon
          label={`Providers with PSYPACT certification can practice in the following states: ${psypactStates}`}
          classNameIcon="ml-1"
          place="right"
        />
      </div>
      <div className="checkbox-tooltip-wrapper">
        <CheckboxController
          control={control}
          name="isAcceptingNewClients"
          defaultValue={query.isAcceptingNewClients}
          onAfterChange={handleAfterChange}
          id="isAcceptingNewClientsFilter"
        >
          Currently accepting new clients
        </CheckboxController>
        <TooltipIcon
          label="Checking this box will show you care options with openings for new clients/patients to
            join."
          classNameIcon="ml-1"
          place="right"
        />
      </div>
      <PreferredTimeFilter
        onAfterChange={onAfterChange}
        query={query}
        register={register}
        control={control}
        dataKey={dataKey}
      />
    </div>
  );
}

AvailabilityFilter.propTypes = {
  register: PropTypes.func,
  name: PropTypes.string,
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
  control: PropTypes.object.isRequired,
  query: PropTypes.shape({
    day: PropTypes.array,
    setting: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    timeZone: PropTypes.string,
    isAcceptingNewClients: PropTypes.bool,
    hasPsypact: PropTypes.bool,
  }),
  availableWorkSettingOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

AvailabilityFilter.defaultProps = {
  query: {
    day: [],
    startTime: undefined,
    endTime: undefined,
    timeZone: undefined,
    setting: SEARCH_WORK_SETTING.BOTH,
    isAcceptingNewClients: false,
    hasPsypact: false,
  },
  availableWorkSettingOptions: SEARCH_AVAILABLE_SETTINGS.map((item) => ({
    value: item.slug,
    label: item.label,
  })),
};
