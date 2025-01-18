import { activityFixtures, appletFixtures, responseFixtures } from '../fixtures';
import { toAppletResponse } from './toAppletResponse';

describe('prepare applet response', () => {
  it('converts applet with one option', async () => {
    const publicId = appletFixtures.defaultPublicId();
    const applet = appletFixtures.defaultApplet();
    const activity = activityFixtures.defaultShallowActivityWithItems();
    const expected = responseFixtures.oneOptionSelectedResponse();
    const screenIndex = 0;
    const nextsAt = {
      [screenIndex]: 1650529992232,
    };
    let responses = [{ value: 0 }];
    const actual = await toAppletResponse({
      publicId,
      applet,
      activity,
      startedAt: expected.responseStarted,
      completedAt: expected.responseCompleted,
      responses,
      nextsAt,
    });

    expect(actual.userPublicKey).toHaveLength(128);

    delete actual.userPublicKey;
    delete expected.userPublicKey;

    delete actual.dataSource;
    delete expected.dataSource;

    expect(actual).toEqual(expected);
  });
});
