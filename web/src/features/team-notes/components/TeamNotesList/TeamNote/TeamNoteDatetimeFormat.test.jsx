import { teamNotesFixtures } from '@/tools/test-fixtures';
import { screen, render } from '@/tools/app-test-utils';
import { TeamNoteDatetimeFormat } from './TeamNoteDatetimeFormat';

beforeAll(() => {
  vi.useFakeTimers('modern');
  vi.setSystemTime(new Date(2021, 11, 1));
});

afterAll(() => {
  vi.useRealTimers();
});

it('renders date and time', async () => {
  const note = teamNotesFixtures.defaultSingleTeamNote();

  await render(<TeamNoteDatetimeFormat date={note.createdAt} />);

  const timeElem = screen.queryByTestId('team-note-time');

  expect(timeElem).toHaveTextContent('8:29 AM');

  const dateDistanceElem = screen.queryByTestId('team-note-date-distance');

  expect(dateDistanceElem).toHaveTextContent('about 1 year ago');
});
