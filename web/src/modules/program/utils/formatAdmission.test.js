import { formatAdmission } from './formatAdmission';

describe('formatAdmission', () => {
  it('formats ongoing admission', () => {
    expect(formatAdmission({ type: 'ONGOING' })).toBe('Ongoing');
  });

  it('formats weekdays admission', () => {
    expect(formatAdmission({ type: 'WEEKDAYS', weekdays: ['TUESDAY', 'FRIDAY', 'SATURDAY'] })).toBe(
      'Tue, Fri, Sat',
    );
  });

  it('formats dates admission', () => {
    expect(
      formatAdmission({
        type: 'DATES',
        dates: [{ start: '2023-03-10T00:00:00.000Z', end: '2023-05-15T00:00:00.000Z' }],
      }),
    ).toBe('10\u00a0Mar–\u206015\u00a0May');

    expect(
      formatAdmission({
        type: 'DATES',
        dates: [
          { start: '2023-01-01T00:00:00.000Z', end: '2023-01-01T00:00:00.000Z' },
          { start: '2023-02-04T00:00:00.000Z', end: '2023-02-07T00:00:00.000Z' },
          { start: '2023-03-10T00:00:00.000Z', end: '2023-05-15T00:00:00.000Z' },
        ],
      }),
    ).toBe('On specific dates');
  });

  it('formats dates admission (verbose)', () => {
    expect(
      formatAdmission(
        {
          type: 'DATES',
          dates: [{ start: '2023-03-10T00:00:00.000Z', end: '2023-05-15T00:00:00.000Z' }],
        },
        { verbose: true },
      ),
    ).toBe('10\u00a0Mar–\u206015\u00a0May');

    expect(
      formatAdmission(
        {
          type: 'DATES',
          dates: [
            { start: '2023-01-01T00:00:00.000Z', end: '2023-01-01T00:00:00.000Z' },
            { start: '2023-02-04T00:00:00.000Z', end: '2023-02-07T00:00:00.000Z' },
            { start: '2023-03-10T00:00:00.000Z', end: '2023-05-15T00:00:00.000Z' },
          ],
        },
        { verbose: true },
      ),
    ).toBe('1\u00a0Jan, 4–\u20607\u00a0Feb, 10\u00a0Mar–\u206015\u00a0May');
  });
});
