import { Alert } from './Alert';
import { Checkmark20Filled as Checkmark, Warning20Regular as Warning } from '@fluentui/react-icons';

export default {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    text: {
      name: 'Text',
    },
  },
};

export let Success = {
  args: {
    className: 'bg-green-100',
    text: 'Invitation is sent',
    iconClasses: 'text-emerald-400',
    icon: <Checkmark size={20} />,
  },
};

export let AlertStoryWarning = {
  args: {
    className: 'bg-yellow-400',
    text: 'Something went wrong. Please try again.',
    iconClasses: 'text-emerald-400',
    icon: <Warning />,
  },
};
