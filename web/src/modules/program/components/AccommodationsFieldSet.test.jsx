import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';

import { AccommodationsFieldSet } from './AccommodationsFieldSet';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

vi.mock('@/core/api/ReferenceDataQueries', () => {
  return {
    useAccommodations: () => {
      return [
        { id: '1', code: 'A1', name: 'NameA1', category: 'Entering the practice' },
        { id: '2', code: 'A2', name: 'NameA2', category: 'Entering the practice' },
        { id: '3', code: 'A3', name: 'NameA3', category: 'Entering the practice' },
        { id: '4', code: 'B1', name: 'NameB1', category: 'Getting around' },
        { id: '5', code: 'B2', name: 'NameB2', category: 'Getting around' },
        { id: '6', code: 'B3', name: 'NameB3', category: 'Getting around' },
        { id: '7', code: 'C1', name: 'NameC1', category: 'Settling in' },
        { id: '8', code: 'C2', name: 'NameC2', category: 'Settling in' },
        { id: '9', code: 'D1', name: 'NameD1', category: 'Communication' },
      ];
    },
    useDietaryAccommodationType: () => {
      return [
        { code: 'WA', name: 'Will accommodate' },
        { code: 'WAWD', name: 'Will accommodate with documentation' },
        { code: 'WANA', name: 'Will not accommodate' },
        { code: 'WAAAPP', name: 'Will accommodate as appropriate' },
        { code: 'WPI', name: 'Please inquire' },
      ];
    },
  };
});

function AccommodationsFieldSetForm({ onSubmit }) {
  const form = useForm();

  function submitForm({ accommodations }) {
    return onSubmit(accommodations);
  }

  // TODO MIR-3020, add loading skeleton
  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <AccommodationsFieldSet name="accommodations" control={form.control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('AccommodationsFieldSet check', () => {
  it('check render AccommodationsFieldSet component', async () => {
    render(<AccommodationsFieldSetForm />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Entering the practice')).toBeInTheDocument();
    expect(screen.getByText('NameA1')).toBeInTheDocument();
    expect(screen.getByText('NameA2')).toBeInTheDocument();
    expect(screen.getByText('NameA3')).toBeInTheDocument();

    expect(screen.getByText('Getting around')).toBeInTheDocument();
    expect(screen.getByText('NameB1')).toBeInTheDocument();
    expect(screen.getByText('NameB2')).toBeInTheDocument();
    expect(screen.getByText('NameB3')).toBeInTheDocument();

    expect(screen.getByText('Settling in')).toBeInTheDocument();

    expect(screen.getByText('NameC1')).toBeInTheDocument();
    expect(screen.getByText('NameC2')).toBeInTheDocument();

    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('NameD1')).toBeInTheDocument();
  });

  it('check submit AccommodationsFieldSet form', async () => {
    const submitSpy = vi.fn();
    render(<AccommodationsFieldSetForm onSubmit={submitSpy} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('NameA1'));
    await userEvent.click(screen.getByText('NameA2'));
    await userEvent.click(screen.getByText('NameA3'));
    await userEvent.click(screen.getByText('NameB1'));
    await userEvent.click(screen.getByText('NameC1'));

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(['1', '2', '3', '4', '7']);
    });
  });
});
