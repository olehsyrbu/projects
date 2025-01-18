import { Toolbar, ToolbarButton } from '../Toolbar';

export default {
  title: 'components/Toolbar',
  component: Toolbar,
};

function CompToolbar({ count, value }) {
  return (
    <Toolbar
      aria-label="Options"
      value={value}
      onChange={(newValues) => {
        console.log('newValues', newValues);
      }}
    >
      {[...Array(count)].map((_, n) => (
        <ToolbarButton value={`option-${n}`}>{`option-${n}`}</ToolbarButton>
      ))}
    </Toolbar>
  );
}

export function ToolbarStory() {
  return (
    <div className="grid gap-4">
      <CompToolbar count={1} />
      <CompToolbar count={2} value={['option-0']} />
      <CompToolbar count={3} value={['option-0', 'option-2']} />
      <CompToolbar count={3} value={['option-0', 'option-1', 'option-2']} />
    </div>
  );
}

ToolbarStory.storyName = 'All Toolbars';

export let Default = {
  render: (args) => <CompToolbar {...args} />,
  args: { count: 1 },
};

export let Selected = {
  render: (args) => <CompToolbar {...args} />,
  args: { count: 2, value: ['option-0'] },
};

export let ManyOptions = {
  render: (args) => <CompToolbar {...args} />,
  args: { count: 5, value: ['option-0'] },
};
