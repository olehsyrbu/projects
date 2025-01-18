import { getMultiProgramTotalTypes } from './getMultiProgramTotalTypes';

describe('get total amount programs from of all types', () => {
  it('should calculate the total amount of types in the locations and remoteTypes', () => {
    const locations = [
      {
        types: {
          PTCBS: 80,
          PTSC: 5,
          PTSBS: 5,
        },
      },
      {
        types: {
          PTCBS: 10,
        },
      },
    ];
    const remoteTypes = {
      PTCBS: 2,
      PTSC: 3,
      PTSBS: 5,
    };
    expect(getMultiProgramTotalTypes(locations, remoteTypes)).toBe(110);
  });
  it('should return 0 if locations or remoteTypes is empty', () => {
    expect(getMultiProgramTotalTypes([], {})).toBe(0);
  });
});
