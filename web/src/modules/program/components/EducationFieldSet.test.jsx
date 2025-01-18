import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import userEvent from '@testing-library/user-event';

import { EducationFieldSet } from './EducationFieldSet';
import { useForm } from 'react-hook-form';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

vi.mock('@/modules/reference-data', async () => ({
  ...(await vi.importActual('@/modules/reference-data')),
  useReferenceData: () => [
    { code: 'A', name: 'NameA' },
    { code: 'B', name: 'NameB' },
    { code: 'C', name: 'NameC' },
  ],
}));

vi.mock('@/modules/reference-data', async () => {
  const actual = await vi.importActual('@/modules/reference-data');
  return {
    ...actual,
    useReferenceData: () => [
      { code: 'A', name: 'NameA' },
      { code: 'B', name: 'NameB' },
      { code: 'C', name: 'NameC' },
    ],
  };
});

const schema = object({
  educations: EducationFieldSet.schema(),
});

function EducationsFieldSetForm({ onSubmit, defaultValues }) {
  const { handleSubmit, control } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  function submitForm(data) {
    return onSubmit(data);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={handleSubmit(submitForm)}>
        <EducationFieldSet name="educations" control={control} />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe('EducationsFieldSet schema validation', () => {
  it('check error if education is empty', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      educations: [
        {
          education: null,
          graduationYear: { value: '2022', label: '2022' },
          schoolName: 'School name 1',
          comment: 'some comment',
        },
      ],
    };
    render(<EducationsFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(1);
    });
  });

  it('check error if graduationYear is empty', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      educations: [
        {
          education: { name: '123' },
          graduationYear: null,
          schoolName: 'School name 1',
          comment: 'some comment',
        },
      ],
    };
    render(<EducationsFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(1);
    });
  });

  it('check error if has only education object', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      educations: [
        {
          education: { name: '123' },
          graduationYear: null,
          schoolName: '',
          comment: '',
        },
      ],
    };
    render(<EducationsFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      const alerts = screen.queryAllByText(/This field is required/i);
      expect(alerts.length).toBe(2);
    });
  });

  it('check error if has only comment', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      educations: [
        {
          education: null,
          graduationYear: null,
          schoolName: '',
          comment: '1',
        },
      ],
    };
    render(<EducationsFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
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

describe('EducationsFieldSet check', () => {
  it('check render EducationsFieldSet component', async () => {
    render(
      <EducationsFieldSetForm
        defaultValues={{
          educations: [
            {
              educationType: null,
              graduationYear: null,
              schoolName: 'School name 1',
              comment: 'some comment',
            },
          ],
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Education type')).toBeInTheDocument();
    expect(screen.getByText(/Year/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/School name 1/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/some comment/i)).toBeInTheDocument();
  });

  it('check submit EducationsFieldSet form', async () => {
    const submitSpy = vi.fn();
    const defaultValues = {
      educations: [
        {
          education: { name: 'nameA', id: 'A' },
          graduationYear: { value: '2022', label: '2022' },
          schoolName: 'School name 1',
          comment: 'some comment',
        },
      ],
    };
    render(<EducationsFieldSetForm defaultValues={defaultValues} onSubmit={submitSpy} />);
    const education = defaultValues.educations[0];
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(education.education.name)).toBeInTheDocument();
    expect(screen.getByText(education.graduationYear.value)).toBeInTheDocument();
    expect(screen.getByDisplayValue(education.schoolName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(education.comment)).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue('School name 1'), ' new');
    expect(screen.getByDisplayValue('School name 1 new')).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue('some comment'), ' old');
    expect(screen.getByDisplayValue('some comment old')).toBeInTheDocument();

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  });
});
