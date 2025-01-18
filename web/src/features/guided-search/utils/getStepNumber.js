export function getStepNumber(state) {
  if (!state?.problem?.length) {
    return 1;
  }

  if (typeof state?.hadVisitedSpecialist !== 'boolean') {
    return 2;
  }

  if (state?.hadVisitedSpecialist && !state?.previousDiagnosis?.length) {
    return 3;
  }

  if (typeof state?.hadSuicidalThoughts !== 'boolean') {
    return 4;
  }

  if (state?.hadSuicidalThoughts && typeof state?.haveSuicidalThoughts !== 'boolean') {
    return 5;
  }

  if (!state?.lookingFor?.length) {
    return 6;
  }

  return 7;
}
