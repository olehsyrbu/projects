import { Tooltip } from './Tooltip';
import { TooltipIcon } from '@/core/components/Tooltip/TooltipIcon';

export default {
  title: 'components/Tooltip',
  component: Tooltip,
};

export function DefaultStory(args) {
  return (
    <div>
      <Tooltip {...args}>
        <button className="mir-button">Button</button>
      </Tooltip>
      <div className="mt-8">
        <span>Some text with tooltip icon</span>
        <TooltipIcon label="Tooltip info text" classNameIcon="ml-2" />
      </div>
    </div>
  );
}

DefaultStory.storyName = 'Tooltip';

DefaultStory.args = {
  label: 'Tooltip for button',
};
