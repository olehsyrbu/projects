import answersMapping from '../answersMapping.json';
import { uniq, isEmpty } from 'lodash-es';

let getUniqCodes = (field, answers) =>
  uniq(answers.map((answer) => answersMapping[field][answer]).flat());

function getUniqSpecialtiesCodes(problem, previousDiagnosis, otherDiagnoses, hadVisitedSpecialist) {
  const specialties = getUniqCodes('problem', problem);
  if (!hadVisitedSpecialist) return specialties;

  return uniq([
    ...specialties,
    ...getUniqCodes('previousDiagnosis', previousDiagnosis),
    ...otherDiagnoses,
  ]);
}

export function getSearchRecord({
  lookingFor = [],
  programTypes = [],
  location = '',
  problem = [],
  hadVisitedSpecialist = false,
  otherDiagnoses = [],
  previousDiagnosis = [],
}) {
  const uniqProgramTypes = getUniqCodes('programTypes', programTypes);
  const uniqLookingFor = getUniqCodes('lookingFor', lookingFor);
  const uniqSpecialties = getUniqSpecialtiesCodes(
    problem,
    previousDiagnosis,
    otherDiagnoses,
    hadVisitedSpecialist,
  );

  return {
    location,
    ...(!isEmpty(uniqSpecialties) && { specialties: uniqSpecialties }),
    ...(!isEmpty(uniqLookingFor) && { providerTypes: uniqLookingFor }),
    ...(!isEmpty(uniqProgramTypes) && { programTypes: uniqProgramTypes }),
  };
}
