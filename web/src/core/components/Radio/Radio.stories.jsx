import { action } from '@storybook/addon-actions';
import { Radio } from './Radio';

export default {
  title: 'Components/Radio',
  component: Radio,
};

function RadioTemplate(args) {
  return <Radio {...args} />;
}

export let RadioDefault = {
  args: {
    children: 'Label',
  },
};

export let RadioDisabled = {
  args: {
    children: 'Label',
    checked: true,
    disabled: true,
  },
};

export function RadioGroup() {
  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
      onSubmit={(event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        action('Fruit submit')(data.get('fruit'));
      }}
    >
      <Radio name="fruit" value="apple" defaultChecked>
        Apple 🍎
      </Radio>
      <Radio name="fruit" value="pear">
        Pear 🍐
      </Radio>
      <Radio name="fruit" value="kiwi" disabled>
        Kiwi 🥝
      </Radio>
      <Radio name="fruit" value="banana" disabled>
        Banana 🍌
      </Radio>
      <Radio name="fruit" value="pineapple">
        Pineapple 🍍
      </Radio>
      <br />
      <button>Submit</button>
    </form>
  );
}

RadioGroup.storyName = 'Radio Group';
