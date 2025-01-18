import { Checkbox } from './Checkbox';

export default {
  title: 'components/Checkbox',
  component: Checkbox,
};

export let Default = {
  name: 'Checkbox',
  args: {
    children: 'Checkbox label',
  },
};

export let Indeterminate = {
  args: {
    children: 'Indeterminate',
    isIndeterminate: true,
  },
};

export let Disabled = {
  args: {
    children: 'Disabled',
    isDisabled: true,
  },
};

export let NoLabel = {};

export let LargeLabel = {
  args: {
    children:
      'I acknowledge the gravity of this decision to check this box, as it may unleash a domino effect of hilarity, resonating through the cosmos and culminating in a cosmic chorus of laughter that transcends time and space.',
  },
};
