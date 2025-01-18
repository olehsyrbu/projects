import { Switch } from '@/core/components/Switch';

export default {
  title: 'components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
};

export let SwitchExample = {
  name: 'Switch',
  args: {
    children: 'Switch label',
    isDisabled: false,
  },
};
