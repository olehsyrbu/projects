import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';
import { PaymentTypeFieldSet } from './PaymentTypeFieldSet';

const paymentsRefData = [
  { code: 'insurance', name: 'Insurance', id: 'insurance_id' },
  { code: 'outofnetwork', name: 'Out-of-network reimbursement filing', id: 'outofnetwork_id' },
  { code: 'outofpocket', name: 'Out-of-pocket', id: 'outofpocket_id' },
];

vi.mock('@/core/api/ReferenceDataQueries', () => ({
  usePaymentOptions: () => paymentsRefData,
}));

function PaymentTypeFieldSetForm({ onSubmit, defaultValues }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      payments: defaultValues.paymentMethods?.map(({ id }) => id) ?? [],
      insurances: defaultValues.insuranceTypes?.map(({ id }) => id) ?? [],
    },
  });

  function submit({ payments }) {
    return onSubmit({ payments });
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={handleSubmit(submit)}>
        <PaymentTypeFieldSet name="payments" control={control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('PaymentTypeFieldSet check', () => {
  it('renders payment types', async () => {
    const testData = {
      defaultValues: {
        paymentMethods: [],
      },
    };
    render(<PaymentTypeFieldSetForm defaultValues={testData.defaultValues} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(paymentsRefData[0].name)).toBeInTheDocument();
    expect(screen.getByText(paymentsRefData[1].name)).toBeInTheDocument();
    expect(screen.getByText(paymentsRefData[2].name)).toBeInTheDocument();
  });

  it('check submit result PaymentTypeFieldSet', async () => {
    defineMatchMediaGlobally(true);
    const submitSpy = vi.fn();
    const testData = {
      defaultValues: {
        paymentMethods: [{ id: 'insurance_id' }],
      },
    };
    render(
      <PaymentTypeFieldSetForm
        title={testData.title}
        defaultValues={testData.defaultValues}
        onSubmit={submitSpy}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(/Out-of-network reimbursement filing/i));
    await userEvent.click(screen.getByText(/Out-of-pocket/i));

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith({
        payments: ['insurance_id', 'outofnetwork_id', 'outofpocket_id'],
      });
    });
  });
});
