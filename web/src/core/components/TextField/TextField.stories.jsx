import { TextField } from './TextField';

export default {
  title: 'components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'password'],
    },
  },
};

export let Default = {
  name: 'TextField',
  args: {
    label: 'Label',
  },
};
