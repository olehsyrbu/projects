import { Suspense } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { CertificationFieldSet } from './CertificationFieldSet';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

function CertificationFieldSetForm({ onSubmit, defaultValues }) {
  const form = useForm({ defaultValues });

  function submitForm({ certifications }) {
    return onSubmit(certifications);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <CertificationFieldSet name="certifications" control={form.control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('CertificationFieldSetForm check', () => {
  it('check submit CertificationFieldSetForm result', async () => {
    const submitSpy = vi.fn();
    const testData = {
      defaultValues: {
        certifications: [
          {
            authority: 'authority test',
            description: 'description test',
            name: 'name test',
          },
          {
            authority: 'authority test 2',
            description: 'description test 2',
            name: 'name test 2',
          },
        ],
      },
    };
    render(
      <CertificationFieldSetForm onSubmit={submitSpy} defaultValues={testData.defaultValues} />,
    );
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[0].authority),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[0].description),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[0].name),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[1].authority),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[1].description),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(testData.defaultValues.certifications[1].name),
    ).toBeInTheDocument();

    await userEvent.type(
      screen.getByDisplayValue(testData.defaultValues.certifications[1].name),
      ' new text',
    );
    expect(screen.getByDisplayValue('authority test')).toBeInTheDocument();

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith([
        {
          authority: 'authority test',
          description: 'description test',
          name: 'name test',
        },
        {
          authority: 'authority test 2',
          description: 'description test 2',
          name: 'name test 2 new text',
        },
      ]);
    });
  });
});
