import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';

import { DietaryAccommodationFieldSet } from './DietaryAccommodationFieldSet';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

vi.mock('@/core/api/ReferenceDataQueries', () => {
  return {
    useDietaryAccommodationType: () => {
      return [
        { id: 'id_WA', code: 'WA', name: 'Will accommodate' },
        { id: 'id_WAWD', code: 'WAWD', name: 'Will accommodate with documentation' },
        { id: 'id_WANA', code: 'WANA', name: 'Will not accommodate' },
        { id: 'id_WAAAPP', code: 'WAAAPP', name: 'Will accommodate as appropriate' },
        { id: 'id_WPI', code: 'WPI', name: 'Please inquire' },
      ];
    },
  };
});

function DietaryAccommodationFieldSetForm({ onSubmit }) {
  const form = useForm();

  function submitForm({ dietaryAccommodations }) {
    return onSubmit(dietaryAccommodations);
  }

  // TODO MIR-3020, add loading skeleton
  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <DietaryAccommodationFieldSet name="dietaryAccommodations" control={form.control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('DietaryAccommodationFieldSet check', () => {
  it('check render DietaryAccommodationFieldSet component', async () => {
    render(<DietaryAccommodationFieldSetForm />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Will accommodate')).toBeInTheDocument();
    expect(screen.getByText('Will accommodate with documentation')).toBeInTheDocument();
    expect(screen.getByText('Will not accommodate')).toBeInTheDocument();
    expect(screen.getByText('Will accommodate as appropriate')).toBeInTheDocument();
    expect(screen.getByText('Please inquire')).toBeInTheDocument();
  });

  it('check submit DietaryAccommodationFieldSet form', async () => {
    const submitSpy = vi.fn();
    render(<DietaryAccommodationFieldSetForm onSubmit={submitSpy} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Will accommodate'));
    await userEvent.click(screen.getByText('Will not accommodate'));
    await userEvent.click(screen.getByText('Will accommodate as appropriate'));

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith('WAAAPP');
    });
  });
});
