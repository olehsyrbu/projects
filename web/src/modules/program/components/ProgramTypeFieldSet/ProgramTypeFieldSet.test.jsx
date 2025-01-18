import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';

import { ProgramTypeFieldSet } from './ProgramTypeFieldSet';
import { useForm } from 'react-hook-form';
import { Details, Summary } from '@/features/guided-search/components/Details';

vi.mock('@/core/api/ReferenceDataQueries', () => ({
  useProgramTypes: () => [
    { code: 'A', name: 'NameA' },
    { code: 'B', name: 'NameB' },
    { code: 'C', name: 'NameC' },
  ],
}));

const programLocations = [
  {
    id: '53357825-3dbe-43e3-9606-b40b2088112b',
    address: {
      state: {
        name: 'Alabama',
      },
      address: '2800 North Main Street',
      address1: 'somewhere',
      city: 'Los Angeles',
      zipCode: '90031',
    },
  },
];

function ProgramsTypeForm({ onSubmit }) {
  const { control, handleSubmit } = useForm({ defaultValues: { programTypes: [] } });

  function submitForm({ programTypes }) {
    let input = programLocations.map((location, index) => ({
      provider_location_id: location.id,
      types: Object.entries(programTypes[index])
        .filter(([_, amount]) => amount > 0)
        .map(([program_type, amount]) => ({ program_type, amount })),
    }));
    return onSubmit(input);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={handleSubmit(submitForm)}>
        {programLocations.map(({ address, id }, index) => {
          const { address1, address2, city, state, zipCode } = address;
          return (
            <Details open={index === 0} key={index}>
              <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
                <div className="flex h-10 basis-3/6 items-center">
                  {address1}, {address2 && `${address2},`} {city},{' '}
                  {state.name.slice(0, 2).toUpperCase()}, {zipCode}
                </div>
              </Summary>
              <ProgramTypeFieldSet
                name={`programTypes.${index}`}
                control={control}
                type="PROGRAM"
              />
            </Details>
          );
        })}
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('ProgramTypeFieldSet check', () => {
  it('check render ProgramTypeFieldSet component', async () => {
    render(<ProgramsTypeForm />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('NameA')).toBeInTheDocument();
    expect(screen.getByText('NameB')).toBeInTheDocument();
    expect(screen.getByText('NameC')).toBeInTheDocument();
  });

  it('check is ProgramTypeFieldSet increment button works', async () => {
    render(<ProgramsTypeForm />);

    const incrementButton = await screen.findAllByRole('button', { name: 'increment' });
    const counters = screen.getAllByTestId('counter');

    await userEvent.click(incrementButton[0]);

    expect(counters[0]).toHaveTextContent(1);

    await userEvent.click(incrementButton[0]);

    expect(counters[0]).toHaveTextContent(2);
  });

  it('check submit ProgramType form', async () => {
    const submitSpy = vi.fn();
    render(<ProgramsTypeForm onSubmit={submitSpy} />);

    const incrementButtons = await screen.findAllByRole('button', { name: 'increment' });

    await userEvent.click(incrementButtons[0]); // A
    await userEvent.click(incrementButtons[1]); // B
    await userEvent.click(incrementButtons[1]); // B
    await userEvent.click(incrementButtons[2]); // C
    await userEvent.click(incrementButtons[2]); // C
    await userEvent.click(incrementButtons[2]); // C

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith([
        {
          provider_location_id: '53357825-3dbe-43e3-9606-b40b2088112b',
          types: [
            { amount: 1, program_type: 'A' },
            { amount: 2, program_type: 'B' },
            {
              amount: 3,
              program_type: 'C',
            },
          ],
        },
      ]);
    });
  });
});
