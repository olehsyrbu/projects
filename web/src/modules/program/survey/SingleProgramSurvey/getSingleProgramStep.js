import { isEmpty } from 'lodash-es';

// TODO: MIR-3350 - extend and cover with more tests
export function getSingleProgramStep(program = {}) {
  const hasGeneralInfo = ({ type, name, center, tagLine }) => type && name && center && tagLine;
  const hasLocation = ({ locations }) => !isEmpty(locations);

  const hasLicense = ({ noLicense, accreditations, licenses }) =>
    !isEmpty(noLicense) || !isEmpty(accreditations) || !isEmpty(licenses);

  const hasRemote = ({ inPerson, remote }) => !inPerson.available && remote.available;

  if (!hasGeneralInfo(program)) {
    return 1;
  }

  if (!hasLocation(program)) {
    return 2;
  }

  if (isEmpty(program.requiredTreatmentAreas) || isEmpty(program.ageGroups)) {
    return 3;
  }

  if (!program.availability?.status) {
    return 4;
  }

  const location = program.locations[0];
  //inPerson locations
  if (program.inPerson?.available && isEmpty(location?.amenities)) {
    return 5;
  }
  //only remote location
  if (hasRemote(program) && isEmpty(program?.preferredContacts)) {
    return 5;
  }

  //inPerson locations
  if (program.inPerson?.available && isEmpty(location?.photos)) {
    return 6;
  }
  //only remote location
  if (hasRemote(program) && isEmpty(program.paymentMethods)) {
    return 6;
  }

  //remote way
  if (hasRemote(program) && !hasLicense(program)) {
    return 7;
  }

  //inPerson locations
  if (program.inPerson?.available && isEmpty(program?.preferredContacts)) {
    return 7;
  }

  if (hasRemote(program) && hasLicense(program)) {
    return 8;
  }

  if (!isEmpty(program?.preferredContacts) && isEmpty(program.paymentMethods)) {
    return 8;
  }

  if (!hasLicense(program)) {
    return 9;
  }

  return 10;
}
