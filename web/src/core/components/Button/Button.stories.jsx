import cn from 'classnames';

export default {
  title: 'Components/Button',
  args: {
    text: 'Button',
    disabled: false,
    appearance: 'default',
    size: 'default',
    icon: 'none',
  },
  argTypes: {
    text: {
      name: 'Text',
    },
    disabled: {
      name: 'Disabled',
    },
    appearance: {
      name: 'Appearance',
      options: ['light', 'primary', 'text'],
      control: {
        type: 'select',
        labels: {
          light: 'Light',
          primary: 'Primary',
          text: 'Text',
        },
      },
    },
    size: {
      name: 'Size',
      options: ['default', 'compact', 'large'],
      control: {
        type: 'select',
        labels: {
          default: 'Default',
          compact: 'Compact',
          large: 'Large',
        },
      },
    },
    icon: {
      name: 'Icon',
      options: ['none', 'left', 'right'],
      control: {
        type: 'select',
        labels: {
          none: 'None',
          left: 'Left icon',
          right: 'Right icon',
        },
      },
    },
  },
};

export function AllButtons() {
  return (
    <div className="grid gap-4">
      <p>PRIMARY NORMAL BUTTONS</p>
      <div className="space-x-4">
        <ButtonTemplate appearance="primary" text="Button" />
        <ButtonTemplate appearance="primary" text="Button" disabled />
      </div>

      <p>DEFAULT NORMAL BUTTONS</p>
      <div className="space-x-4">
        <ButtonTemplate appearance="default" text="Button" icon="none" />
        <ButtonTemplate appearance="default" text="Button" icon="none" disabled />
      </div>

      <p>PRIMARY COMPACT BUTTONS</p>
      <div className="space-x-4">
        <ButtonTemplate appearance="primary" size="compact" text="Button" />
        <ButtonTemplate appearance="primary" size="compact" text="Button" disabled />
      </div>

      <p>PRIMARY COMPACT BUTTONS</p>
      <div className="space-x-4">
        <ButtonTemplate appearance="default" size="compact" text="Button" />
        <ButtonTemplate appearance="default" size="compact" text="Button" disabled />
      </div>

      <p>TERTIARY NORMAL BUTTONS</p>
      <div className="space-x-4">
        <ButtonTemplate appearance="text" size="compact" text="Button" />
        <ButtonTemplate appearance="text" size="compact" text="Button" disabled />
      </div>

      <p>LEFT ICON</p>
      <div className="space-x-4">
        <ButtonTemplate text="Send" appearance="primary" icon="left" />
        <ButtonTemplate text="Send" appearance="primary" icon="left" disabled />
      </div>
      <div className="space-x-4">
        <ButtonTemplate text="Send" appearance="default" icon="left" />
        <ButtonTemplate text="Send" appearance="default" icon="left" disabled />
      </div>

      <p>Right ICON</p>
      <div className="space-x-4">
        <ButtonTemplate text="Send" appearance="primary" icon="right" />
        <ButtonTemplate text="Send" appearance="primary" icon="right" disabled />
      </div>
      <div className="space-x-4">
        <ButtonTemplate text="Send" appearance="default" icon="right" />
        <ButtonTemplate text="Send" appearance="default" icon="right" disabled />
      </div>
    </div>
  );
}

function ButtonTemplate({ text, appearance, size, icon, ...rest }) {
  return (
    <button
      className={cn('mir-button', {
        primary: appearance === 'primary',
        light: appearance === 'light',
        text: appearance === 'text',
        compact: size === 'compact',
        large: size === 'large',
      })}
      {...rest}
    >
      {icon === 'left' && <ChevronIcon />}
      {icon !== 'none' ? <span>{text}</span> : text}
      {icon === 'right' && <ChevronIcon />}
    </button>
  );
}

export let Default = ButtonTemplate.bind({});

export let AppearancePrimary = {
  render: (args) => <ButtonTemplate {...args} />,
  args: { appearance: 'primary' },
};

export let AppearanceText = {
  render: (args) => <ButtonTemplate {...args} />,
  args: { appearance: 'text' },
};

export let AppearanceLight = {
  render: (args) => <ButtonTemplate {...args} />,
  args: {
    text: 'Show more',
    appearance: 'light',
  },
};

export let SizeCompact = {
  render: (args) => <ButtonTemplate {...args} />,
  args: { size: 'compact' },
};

export let SizeLarge = {
  render: (args) => <ButtonTemplate {...args} />,
  args: { size: 'large' },
};

export let LeftIcon = {
  render: (args) => <ButtonTemplate {...args} />,
  args: {
    text: 'Send',
    appearance: 'primary',
    icon: 'left',
  },
};
export let RightIcon = {
  render: (args) => <ButtonTemplate {...args} />,
  args: {
    text: 'Show more',
    appearance: 'primary',
    icon: 'right',
  },
};

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M8.29289 4.29289C7.90237 4.68342 7.90237 5.31658 8.29289 5.70711L14.5858 12L8.29289 18.2929C7.90237 18.6834 7.90237 19.3166 8.29289 19.7071C8.68342 20.0976 9.31658 20.0976 9.70711 19.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L9.70711 4.29289C9.31658 3.90237 8.68342 3.90237 8.29289 4.29289Z" />
    </svg>
  );
}
