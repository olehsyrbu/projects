import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';

import {
  AdmissionDateRangePicker,
  AdmissionDays,
  AdmissionScheduleFieldSet,
} from '@/modules/program/components';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

function AdmissionScheduleFieldSetForm({ onSubmit, defaultValues }) {
  const { watch, handleSubmit, control } = useForm({ defaultValues });

  function submitForm({ scheduleOption, scheduleWeekDays, scheduleDates }) {
    return onSubmit({
      scheduleOption,
      scheduleWeekDays: Object.entries(scheduleWeekDays)
        .map(function ([day, value]) {
          if (value) return day;
          return undefined;
        })
        .filter(Boolean),
      scheduleDates: scheduleDates.map((date) => ({
        start: new Date(date.start).toISOString(),
        end: new Date(date.end).toISOString(),
      })),
    });
  }

  const scheduleOption = watch('scheduleOption');
  return (
    <Suspense fallback="Loading...">
      <form onSubmit={handleSubmit(submitForm)}>
        <AdmissionScheduleFieldSet name="scheduleOption" control={control}>
          {scheduleOption === 'week' && (
            <AdmissionDays
              className="flex flex-row gap-x-4"
              name="scheduleWeekDays"
              control={control}
            />
          )}
          {scheduleOption === 'dates' && (
            <AdmissionDateRangePicker control={control} name="scheduleDates" />
          )}
        </AdmissionScheduleFieldSet>
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

describe.skip('AdmissionScheduleFieldSet form', () => {
  const testData = {
    scheduleOption: null,
    scheduleWeekDays: {},
    scheduleDates: [{ start: '2022-08-11T00:00:00.000Z', end: '2022-08-11T00:00:00.000Z' }],
  };

  it('check render AdmissionScheduleFieldSet component', async () => {
    render(<AdmissionScheduleFieldSetForm defaultValues={testData} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
    expect(screen.getByText('Specific days of week')).toBeInTheDocument();
    expect(screen.getByText('Select dates')).toBeInTheDocument();
  });

  it('check radio selection', async () => {
    render(<AdmissionScheduleFieldSetForm />);
    const ongoingRadio = screen.getByLabelText('Ongoing');

    expect(ongoingRadio).not.toBeChecked();
    fireEvent.click(ongoingRadio);

    expect(ongoingRadio).toBeChecked();
    expect(ongoingRadio.value).toBe('ongoing');
    const specificDaysRadio = screen.getByLabelText('Specific days of week');

    fireEvent.click(specificDaysRadio);
    expect(specificDaysRadio).toBeChecked();
    expect(specificDaysRadio.value).toBe('week');
  });

  it('check submit data', async () => {
    const submitSpy = vi.fn();
    render(<AdmissionScheduleFieldSetForm onSubmit={submitSpy} defaultValues={testData} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Specific days of week'));

    fireEvent.click(screen.getByLabelText('Mon'));
    fireEvent.click(screen.getByLabelText('Tue'));

    // select date in Calendar;
    fireEvent.click(screen.getByLabelText('Select dates'));
    fireEvent.click(screen.getByLabelText('From'));
    fireEvent.click(screen.getByText('11'));

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith({
        scheduleOption: 'dates',
        scheduleWeekDays: ['Mon', 'Tue'],
        scheduleDates: [
          {
            start: expect.stringMatching(/\d{4}-\d{2}-11T00:00:00.000Z/),
            end: expect.stringMatching(/\d{4}-\d{2}-11T00:00:00.000Z/),
          },
        ],
      });
    });
  });
});
