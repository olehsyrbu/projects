import { useActualValue } from './useActualValue';
import { useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Uncontrolled() {
  let ref = useRef();
  let actualValue = useActualValue(ref);

  return (
    <>
      <input ref={ref} defaultValue="default value" />
      <span>{actualValue}</span>
    </>
  );
}

function Controlled() {
  let ref = useRef();
  let [value, setValue] = useState('initial value');
  let actualValue = useActualValue(ref, value);

  return (
    <>
      <input ref={ref} value={value} onChange={(e) => setValue(e.target.value)} />
      <span>{actualValue}</span>
    </>
  );
}

it('tracks uncontrolled value', async () => {
  render(<Uncontrolled />);

  expect(screen.getByText('default value')).toBeInTheDocument();

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(screen.getByRole('textbox'), 'new value');

  expect(screen.getByText('new value')).toBeInTheDocument();
});

it('tracks controlled value', async () => {
  render(<Controlled />);

  expect(screen.getByText('initial value')).toBeInTheDocument();

  await userEvent.clear(screen.getByRole('textbox'));
  await userEvent.type(screen.getByRole('textbox'), 'updated value');

  expect(screen.getByText('updated value')).toBeInTheDocument();
});
