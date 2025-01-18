import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import userEvent from '@testing-library/user-event';

import { ContactFieldSet } from './ContactFieldSet';
import { useForm } from 'react-hook-form';

function ContactFieldSetForm({ onSubmit }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      contacts: {
        email: '',
        mobile: '',
        admissionPhone: '',
        onlineScheduler: '',
        preferredContacts: [],
      },
    },
  });

  function submitForm(data) {
    return onSubmit(data);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={handleSubmit(submitForm)}>
        <ContactFieldSet name="contacts" control={control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('ContactFieldSet check', () => {
  it('check render ContactFieldSet component', async () => {
    render(<ContactFieldSetForm />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const preferredContact = await screen.findAllByText(/Preferred Contact/i);
    expect(preferredContact.length).toBe(4);

    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/General office phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Admissions phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Online scheduler/i)).toBeInTheDocument();
  });

  it('check submit ContactFieldSet form with disabled preferredContact', async () => {
    const submitSpy = vi.fn();
    render(<ContactFieldSetForm onSubmit={submitSpy} />);

    const inputEmail = screen.getByLabelText('Email');
    const inputGeneralPhone = screen.getByLabelText('General office phone');
    const inputAdmissionsPhone = screen.getByLabelText('Admissions phone');
    const inputOnlineScheduler = screen.getByLabelText('Online scheduler (optional)');

    const preferredContact = screen.getAllByLabelText('Preferred contact');
    await userEvent.click(preferredContact[1]);

    fireEvent.change(inputEmail, { target: { value: 'oleg@gmail.com' } });
    fireEvent.change(inputGeneralPhone, { target: { value: '222333444' } });
    fireEvent.change(inputAdmissionsPhone, { target: { value: '888999000' } });
    fireEvent.change(inputOnlineScheduler, { target: { value: 'some-online-scheduler' } });

    expect(inputEmail.value).toBe('oleg@gmail.com');
    expect(inputGeneralPhone.value).toBe('222333444');
    expect(inputAdmissionsPhone.value).toBe('888999000');
    expect(inputOnlineScheduler.value).toBe('some-online-scheduler');

    await userEvent.click(preferredContact[2]);
    await userEvent.click(preferredContact[3]);

    expect(submitSpy).not.toHaveBeenCalled();

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith({
        contacts: {
          admissionPhone: '888999000',
          email: 'oleg@gmail.com',
          mobile: '222333444',
          onlineScheduler: 'some-online-scheduler',
          preferredContacts: ['ADMISSION_PHONE', 'ONLINE_SCHEDULER'],
        },
      });
    });
  });
});

describe('ContactFieldSet toValueApi', () => {
  it('returns the expected object with all fields filled', () => {
    const formValue = {
      email: 'test@test.com',
      mobile: '1234567890',
      onlineScheduler: 'http://example.com',
      preferredContacts: ['EMAIL', 'MOBILE', 'ADMISSION_PHONE'],
      admissionPhone: '0987654321',
    };

    const expectedPatch = {
      email: 'test@test.com',
      mobile: '1234567890',
      onlineScheduler: 'http://example.com',
      preferredContacts: ['EMAIL', 'MOBILE', 'ADMISSION_PHONE'],
      admissionPhone: '0987654321',
    };

    const patch = ContactFieldSet.toValueApi(formValue);

    expect(patch).toEqual(expectedPatch);
  });

  it('returns the expected patch object with all fields missing', () => {
    const formValue = {
      email: '',
      mobile: '',
      onlineScheduler: '',
      preferredContacts: [],
      admissionPhone: '',
    };

    const expectedPatch = {
      email: null,
      mobile: null,
      onlineScheduler: null,
      preferredContacts: [],
      admissionPhone: null,
    };

    const patch = ContactFieldSet.toValueApi(formValue);

    expect(patch).toEqual(expectedPatch);
  });

  it('returns correct preferredContacts without empty field', () => {
    const formValue = {
      email: null,
      mobile: '1234567890',
      onlineScheduler: 'http://example.com',
      preferredContacts: ['EMAIL', 'MOBILE'],
      admissionPhone: null,
    };

    const expectedPatch = {
      email: null,
      mobile: '1234567890',
      onlineScheduler: 'http://example.com',
      preferredContacts: ['MOBILE'],
      admissionPhone: null,
    };

    const patch = ContactFieldSet.toValueApi(formValue);

    expect(patch).toEqual(expectedPatch);
  });
});
