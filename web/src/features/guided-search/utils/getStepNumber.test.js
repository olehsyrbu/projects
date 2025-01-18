import { getStepNumber } from './getStepNumber';

let state = {
  problem: ['X'],
  hadVisitedSpecialist: false,
  previousDiagnosis: ['X'],
  hadSuicidalThoughts: false,
  haveSuicidalThoughts: false,
  lookingFor: ['X'],
  location: 'Boston, NY',
};

it('correctly returns 1', () => {
  expect(getStepNumber()).toBe(1);
  expect(getStepNumber({})).toBe(1);
  expect(getStepNumber({ problem: [] })).toBe(1);
});

it('correctly returns 2', () => {
  expect(getStepNumber({ ...state, hadVisitedSpecialist: null })).toBe(2);
});

it('correctly returns 3', () => {
  expect(getStepNumber({ ...state, hadVisitedSpecialist: true, previousDiagnosis: [] })).toBe(3);
});

it('correctly returns 4', () => {
  expect(getStepNumber({ ...state, hadSuicidalThoughts: null })).toBe(4);
});

it('correctly returns 5', () => {
  expect(
    getStepNumber({
      ...state,
      hadSuicidalThoughts: true,
      haveSuicidalThoughts: null,
    }),
  ).toBe(5);
});

it('correctly returns 6', () => {
  expect(getStepNumber({ ...state, lookingFor: [] })).toBe(6);
});

it('returns 7 by default', () => {
  expect(getStepNumber(state)).toBe(7);
});
