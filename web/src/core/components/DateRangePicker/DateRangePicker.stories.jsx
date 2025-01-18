import { DateRangePicker } from '@/core/components';

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  args: {
    value: {
      start: '',
      end: '',
    },
  },
  argTypes: {
    labelStart: {
      name: 'labelStart',
    },
    labelEnd: {
      name: 'labelEnd',
    },
    value: { control: 'object' },
    error: { control: 'object' },
  },
};

function DateRangeTemplate(args) {
  return <DateRangePicker className="flex-col md:inline-flex md:flex-row" {...args} />;
}

export let DateRangePickerDefault = DateRangeTemplate.bind({});

export let DateRangePickerValue = DateRangeTemplate.bind({});

DateRangePickerValue.args = {
  value: { start: new Date('2040-08-01'), end: new Date('2040-08-10') },
};

DateRangePickerValue.storyName = 'DateRangePicker Values';

export function DateRangePickerError(args) {
  return <DateRangePicker {...args} />;
}

DateRangePickerError.args = {
  value: { start: new Date('2040-09-01'), end: new Date('2040-09-10') },
  error: {
    start: 'This is required',
    end: 'This is required',
  },
};

DateRangePickerError.storyName = 'DateRangePicker Error';
