import { DatePicker } from '@/core/components';
import { useState } from 'react';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  args: {
    label: 'label',
    value: new Date('02/04/2030'),
    onChange: action('onChange'),
  },
  argTypes: {
    value: { control: 'date' },
    onChange: { action: 'onChange' },
    label: {
      name: 'Label',
    },
  },
};

function DatePickerTemplate(args) {
  const [value, setValue] = useState(args.value);
  return <DatePicker {...args} className="!w-80" value={value} onChange={setValue} />;
}

export let DatePickerDefault = {
  render: (args) => <DatePickerTemplate {...args} />,
  args: { value: null, label: 'From' },
};
export let DatePickerValue = {
  render: (args) => <DatePickerTemplate {...args} />,
  args: { value: new Date('02/04/2030'), label: 'Some Label' },
};

export let DatePickerError = DatePickerTemplate.bind({});
DatePickerError.args = {
  value: new Date('02/04/2030'),
  label: 'Some Label',
  error: { message: 'date is invalid' },
};

export let DatePickerDisabled = DatePickerTemplate.bind({});
DatePickerDisabled.args = {
  value: new Date('02/04/2030'),
  label: 'Some Label',
  disabled: true,
};
