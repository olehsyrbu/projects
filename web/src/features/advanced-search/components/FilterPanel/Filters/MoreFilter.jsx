import PropTypes from 'prop-types';
import { TooltipIcon } from '@/core/components/Tooltip';
import { SEARCH_AVAILABLE_SETTINGS, SEARCH_WORK_SETTING } from '@/modules/search/utils';
import {
  CheckboxController,
  ReferenceDataSelectController,
  SelectController,
} from './FilterControllers';

export function MoreFilter({
  control,
  query,
  availableWorkSettingOptions,
  dataKey,
  onAfterChange,
}) {
  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, next, prev });
  }

  return (
    <div className="space-y-4">
      <ReferenceDataSelectController
        name="programTypes"
        type="ProgramType"
        label="Program type"
        defaultValue={query.programTypes}
        onAfterChange={handleAfterChange}
        modes="PROGRAM"
        id="programTypeFilter"
      />
      <SelectController
        name="setting"
        control={control}
        defaultValue={query.setting}
        onAfterChange={handleAfterChange}
        options={availableWorkSettingOptions}
        label="Remote and in-person"
        id="settingFilter"
      />
      <div className="flex items-center space-x-2">
        <CheckboxController
          control={control}
          name="isAcceptingNewClients"
          defaultValue={query.isAcceptingNewClients}
          onAfterChange={handleAfterChange}
          id="acceptingNewClientsFilter"
        >
          Currently accepting new clients
        </CheckboxController>
        <TooltipIcon
          label="Checking this box will show you care options with openings for new clients/patients to
            join."
          place="right"
        />
      </div>
    </div>
  );
}

MoreFilter.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object.isRequired,
  onAfterChange: PropTypes.func,
  defaultValue: PropTypes.string,
  dataKey: PropTypes.string,
  query: PropTypes.object,
  availableWorkSettingOptions: PropTypes.array,
};

MoreFilter.defaultProps = {
  query: {
    programTypes: [],
    setting: SEARCH_WORK_SETTING.BOTH,
    isAcceptingNewClients: false,
  },
  availableWorkSettingOptions: SEARCH_AVAILABLE_SETTINGS.map((item) => ({
    value: item.slug,
    label: item.label,
  })),
};
