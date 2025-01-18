import { useController } from 'react-hook-form';
import { Button, Item, Label, ListBox, Popover, Select, SelectValue } from 'react-aria-components';
import PropTypes from 'prop-types';
import { Checkmark24Filled as Checkmark } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import { SEARCH_AVAILABLE_SETTINGS } from '@/modules/search/utils';

export function SettingField() {
  const isMediumScreen = useScreen('md');
  let controller = useController({ name: 'setting' });

  return isMediumScreen ? (
    <SettingFieldDesktop {...controller} />
  ) : (
    <SettingFieldMobile {...controller} />
  );
}

function SettingFieldDesktop({ field }) {
  return (
    <Select
      className="field relative"
      style={{ width: 242 }}
      {...field}
      selectedKey={field.value}
      onSelectionChange={field.onChange}
    >
      <Button className="field-input absolute inset-0 flex !h-auto flex-col !px-6 !py-3.5">
        <Label className="field-label">Setting</Label>
        <SelectValue />
      </Button>
      <Popover className="mir-dropdown">
        <ListBox className="mir-option-list">
          {SEARCH_AVAILABLE_SETTINGS.map((setting) => (
            <Item
              key={setting.slug}
              id={setting.slug}
              textValue={setting.label}
              className="mir-option-list-item flex justify-between outline-none focus-visible:bg-p-10 aria-selected:!bg-p-20"
            >
              {({ isSelected }) => (
                <>
                  {setting.label}
                  {isSelected ? <Checkmark className="ml-3 text-p-100" /> : null}
                </>
              )}
            </Item>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

SettingFieldDesktop.propTypes = {
  field: PropTypes.any,
};

function SettingFieldMobile({ field, hiddenSelectStyle }) {
  let { value } = field;
  let selectedOption = SEARCH_AVAILABLE_SETTINGS.find((setting) => setting.slug === value);
  return (
    <div className="field">
      <p className="field-input" aria-hidden="true">
        {selectedOption.label}
      </p>
      <select {...field} style={hiddenSelectStyle} aria-label="Setting">
        {SEARCH_AVAILABLE_SETTINGS.map((setting) => (
          <option key={setting.slug} value={setting.slug}>
            {setting.label}
          </option>
        ))}
      </select>
    </div>
  );
}

SettingFieldMobile.propTypes = {
  field: PropTypes.any,
  hiddenSelectStyle: PropTypes.object,
};

SettingFieldMobile.defaultProps = {
  hiddenSelectStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    fontSize: '1rem',
    opacity: 0,
  },
};
