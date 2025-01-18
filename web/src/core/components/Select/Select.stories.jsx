import { useState } from 'react';
import { Select } from '@/core/components/Select';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Select',
  argTypes: {
    options: { control: 'object' },
  },
  component: Select,
};

function SelectTemplate(args) {
  const [selectedOption, setSelectedOption] = useState(args.value);
  return (
    <Select
      {...args}
      value={selectedOption}
      onChange={(selectedOption) => {
        setSelectedOption(selectedOption);
        action('onChange')(selectedOption);
      }}
    />
  );
}

export let DefaultSelect = {
  render: (args) => <SelectTemplate {...args} />,
  args: {
    label: 'Label text',
    isMulti: false,
    options: [
      { value: '1', label: 'Academy of Certified Social Workers License (ACSW)' },
      { value: '2', label: 'Board Certified Behavior Analyst (BCBA)' },
      { value: '3', label: 'Certified Addiction Counselor (CAC)' },
      { value: '4', label: 'Certified Group Psychotherapist (CGP)' },
      { value: '5', label: 'Academy of Certified Social Workers License (ACSW) 2' },
      { value: '6', label: 'Board Certified Behavior Analyst (BCBA) 2' },
      { value: '7', label: 'Certified Addiction Counselor (CAC) 2' },
      { value: '8', label: 'Certified Group Psychotherapist (CGP) 2' },
      { value: '9', label: 'Certified Group Psychotherapist (CGP) 3' },
    ],
  },
};

export let SelectDisabledStory = {
  render: (args) => <SelectTemplate {...args} />,
  name: 'Select Disabled',
  args: {
    ...DefaultSelect.args,
    disabled: true,
  },
};

export let SelectMobileInput = {
  render: (args) => <SelectTemplate {...args} />,
  name: 'Select Mobile view, with input text Academy',
  args: {
    ...DefaultSelect.args,
    value: { value: '1', label: 'Academy of Certified Social Workers License (ACSW)' },
    inputText: 'Academy',
  },
  parameters: {
    viewport: {
      viewports: {
        iphoneX: {
          name: 'iPhone X',
          styles: {
            width: '375px',
            height: '812px',
          },
          type: 'mobile',
        },
      },
      defaultViewport: 'iphoneX',
    },
  },
};

export let MultiSelectDefault = {
  render: (args) => <SelectTemplate {...args} />,
  name: 'Multi Select with values',
  args: {
    ...DefaultSelect.args,
    isMulti: true,
    value: [
      { value: '1', label: 'Academy' },
      { value: '2', label: 'Board' },
      { value: '3', label: 'Certified (CAC)' },
    ],
  },
};

export let MultiSelectInvalid = {
  render: (args) => <SelectTemplate {...args} />,
  name: 'Multi Select Error',
  args: {
    ...DefaultSelect.args,
    invalid: true,
    errorMessage: 'This is required',
    value: [],
    isMulti: true,
  },
};
