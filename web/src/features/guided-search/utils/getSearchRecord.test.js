import { getSearchRecord } from './getSearchRecord';
import answersMapping from '../answersMapping.json';
import { uniq } from 'lodash-es';

it('return record providerTypes with someoneToTalk, diagnosis, medicationPrescription', () => {
  let state = {
    problem: ['griefOrLoss'],
    hadVisitedSpecialist: false,
    lookingFor: ['someoneToTalk', 'diagnosis', 'medicationPrescription'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    specialties: uniq([...answersMapping.problem.griefOrLoss]),
    providerTypes: uniq([
      ...answersMapping.lookingFor.someoneToTalk,
      ...answersMapping.lookingFor.diagnosis,
      ...answersMapping.lookingFor.medicationPrescription,
    ]),
    location: state.location,
  });
});

it('returns record with reference data codes Problem substanceUse', () => {
  let state = {
    problem: ['substanceUse'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    specialties: uniq([...answersMapping.problem.substanceUse]),
    location: state.location,
  });
});

it('returns record with reference data codes all Problems', () => {
  let state = {
    problem: [
      'substanceUse',
      'relationships',
      'griefOrLoss',
      'stress',
      'trauma',
      'sexualOrGenderIdentity',
      'lovingAndAcceptingMyself',
      'dontFeelLikeMyself',
      'sleepConcerns',
    ],
    hadVisitedSpecialist: false,
    previousDiagnosis: ['ptsd', 'eatingDisorder', 'insomnia', 'other'],
    otherDiagnoses: ['ABC', 'EFG'],
    lookingFor: ['diagnosis', 'medicationPrescription'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    specialties: uniq([
      ...answersMapping.problem.substanceUse,
      ...answersMapping.problem.relationships,
      ...answersMapping.problem.griefOrLoss,
      ...answersMapping.problem.stress,
      ...answersMapping.problem.trauma,
      ...answersMapping.problem.sexualOrGenderIdentity,
      ...answersMapping.problem.lovingAndAcceptingMyself,
      ...answersMapping.problem.dontFeelLikeMyself,
      ...answersMapping.problem.sleepConcerns,
    ]),
    providerTypes: uniq([
      ...answersMapping.lookingFor.diagnosis,
      ...answersMapping.lookingFor.medicationPrescription,
    ]),
    location: state.location,
  });
});

it('return record specialties with select previousDiagnosis', () => {
  const { specialties } = getSearchRecord({
    hadVisitedSpecialist: true,
    previousDiagnosis: [
      'anxiety',
      'depression',
      'ptsd',
      'eatingDisorder',
      'adhd',
      'substanceUse',
      'selfHarm',
      'bipolar',
      'ocd',
      'autism',
      'insomnia',
      'dontKnow',
      'other',
    ],
  });

  expect(specialties).toEqual(
    Array.from(new Set([...Object.values(answersMapping.previousDiagnosis).flat()])),
  );
});

it('returns record with reference data codes including previous diagnosis', () => {
  let state = {
    problem: ['griefOrLoss', 'trauma', 'sleepConcerns'],
    hadVisitedSpecialist: true,
    otherDiagnoses: ['ABC', 'EFG'],
    lookingFor: ['diagnosis', 'medicationPrescription'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    specialties: uniq([
      ...answersMapping.problem.griefOrLoss,
      ...answersMapping.problem.trauma,
      ...answersMapping.problem.sleepConcerns,
      ...state.otherDiagnoses,
    ]),
    providerTypes: uniq([
      ...answersMapping.lookingFor.diagnosis,
      ...answersMapping.lookingFor.medicationPrescription,
    ]),
    location: state.location,
  });
});

it('returns record with codes program types inpatientTreatment', () => {
  let state = {
    programTypes: ['inpatientTreatment'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    location: 'Boston, MA',
    programTypes: uniq(answersMapping.programTypes.inpatientTreatment),
  });
});

it('returns record with codes program types crisisServices', () => {
  let state = {
    programTypes: ['crisisServices'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    location: 'Boston, MA',
    programTypes: uniq(answersMapping.programTypes.crisisServices),
  });
});

it('returns record with codes program types residentialProgram', () => {
  let state = {
    programTypes: ['residentialProgram'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    location: 'Boston, MA',
    programTypes: uniq(answersMapping.programTypes.residentialProgram),
  });
});

it('returns record with codes program types outpatientProgram', () => {
  let state = {
    programTypes: ['outpatientProgram'],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    location: 'Boston, MA',
    programTypes: uniq(answersMapping.programTypes.outpatientProgram),
  });
});

it('returns record with codes all program types', () => {
  let state = {
    programTypes: [
      'outpatientProgram',
      'residentialProgram',
      'crisisServices',
      'inpatientTreatment',
    ],
    location: 'Boston, MA',
  };

  expect(getSearchRecord(state)).toEqual({
    location: 'Boston, MA',
    programTypes: uniq([
      ...answersMapping.programTypes.outpatientProgram,
      ...answersMapping.programTypes.residentialProgram,
      ...answersMapping.programTypes.crisisServices,
      ...answersMapping.programTypes.inpatientTreatment,
    ]),
  });
});
