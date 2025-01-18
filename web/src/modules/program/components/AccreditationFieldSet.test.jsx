import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { AccreditationFieldSet } from './AccreditationFieldSet';
import userEvent from '@testing-library/user-event';

function AccreditationFieldSetForm({ onSubmit, defaultValues }) {
  const form = useForm({
    defaultValues,
  });

  function submitForm({ accreditations }) {
    return onSubmit(accreditations);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <AccreditationFieldSet name="accreditations" control={form.control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

const testData = {
  defaultValues: {
    accreditations: [
      {
        code: 1,
        body: 'accreditation A',
        accreditedAt: '10/22/2022',
        expiredAt: '01/01/2033',
      },
      {
        code: 2,
        body: 'accreditation B',
        accreditedAt: '11/22/2022',
        expiredAt: '02/01/2033',
      },
      {
        code: 3,
        body: 'accreditation C',
        accreditedAt: '12/22/2022',
        expiredAt: '03/01/2033',
      },
    ],
  },
};

describe('accreditations check', () => {
  it('check render accreditations component', async () => {
    render(<AccreditationFieldSetForm defaultValues={testData.defaultValues} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[0].body),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[0].accreditedAt),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[0].expiredAt),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[1].body),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[1].accreditedAt),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[1].expiredAt),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[2].body),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[2].accreditedAt),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.accreditations[2].expiredAt),
    ).toBeInTheDocument();
  });

  it('check submit AccreditationFieldSetForm form', async () => {
    const submitSpy = vi.fn();
    render(
      <AccreditationFieldSetForm onSubmit={submitSpy} defaultValues={testData.defaultValues} />,
    );
    const accreditingBody = await screen.findAllByPlaceholderText('Accrediting body');
    await userEvent.type(accreditingBody[0], ' new text');
    expect(screen.getByDisplayValue('accreditation A new text')).toBeInTheDocument();

    await userEvent.type(accreditingBody[1], ' new text B');
    expect(screen.getByDisplayValue('accreditation B new text B')).toBeInTheDocument();

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith([
        {
          accreditedAt: '10/22/2022',
          code: 1,
          expiredAt: '01/01/2033',
          body: 'accreditation A new text',
        },
        {
          accreditedAt: '11/22/2022',
          code: 2,
          expiredAt: '02/01/2033',
          body: 'accreditation B new text B',
        },
        {
          accreditedAt: '12/22/2022',
          code: 3,
          expiredAt: '03/01/2033',
          body: 'accreditation C',
        },
      ]);
    });
  });
});
