import { Suspense } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { LicenseFieldSet } from './LicenseFieldSet';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

vi.mock('@/core/api/StatesAPI', () => {
  return {
    fetchStates: () => {
      return Promise.resolve([
        { code: 'AL', name: 'Alabama', id: '1' },
        { code: 'AZ', name: 'Arizona', id: '2' },
        { code: 'CA', name: 'California', id: '3' },
      ]);
    },
  };
});

const schema = object({
  licenses: LicenseFieldSet.schema(),
});

function LicenseFieldSetForm({ onSubmit, defaultValues }) {
  const form = useForm({ defaultValues, resolver: yupResolver(schema) });

  function submitForm({ licenses }) {
    return onSubmit(LicenseFieldSet.toValueApi(licenses));
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <LicenseFieldSet name="licenses" control={form.control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('LicenseFieldSetForm check', () => {
  const defaultValues = {
    licenses: [
      {
        name: '123',
        state: { id: '1' },
        organization: 'licensingBody text',
        number: 'number text',
        expiredAt: '12/20/2030',
        setting: 'setting text',
        type: 'type text',
      },
    ],
  };

  it('check render LicenseFieldSetForm component', async () => {
    render(<LicenseFieldSetForm defaultValues={defaultValues} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Licensing body (optional)')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Expiration Date')).toBeInTheDocument();
  });

  it('check submit LicenseFieldSetForm result', async () => {
    const submitSpy = vi.fn();

    render(<LicenseFieldSetForm onSubmit={submitSpy} defaultValues={defaultValues} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue(defaultValues.licenses[0].organization)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultValues.licenses[0].number)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultValues.licenses[0].expiredAt)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Licensing body (optional)'), ' new');
    expect(screen.getByDisplayValue('licensingBody text new')).toBeInTheDocument();

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith([
        {
          expiredAt: '12/20/2030',
          name: '123',
          number: 'number text',
          organization: 'licensingBody text new',
          setting: 'setting text',
          stateId: '1',
          type: 'type text',
        },
      ]);
    });
  });
});

describe('LicenseFieldSet schema validation', () => {
  it('has only preset organization field in form', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      licenses: [{ organization: '123' }],
    };
    render(<LicenseFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(3);
    });
    await waitFor(() => {
      const expiredAt = screen.queryAllByText(/Please enter a valid date/i);
      expect(expiredAt.length).toBe(1);
    });
  });
  it('has only preset name field in form', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      licenses: [
        {
          name: '123',
        },
      ],
    };
    render(<LicenseFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(2);
    });
  });
  it('has only preset number field in form', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      licenses: [
        {
          number: '123',
        },
      ],
    };
    render(<LicenseFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(2);
    });
  });

  it('has only preset expiredAt field in form', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      licenses: [
        {
          expiredAt: '12/12/2222',
        },
      ],
    };
    render(<LicenseFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(3);
    });
  });
});
