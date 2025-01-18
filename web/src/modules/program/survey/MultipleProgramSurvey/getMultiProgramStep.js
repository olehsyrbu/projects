// TODO: MIR-3351 - extend and cover with more tests
import { isEmpty, first } from 'lodash-es';

export function getMultiProgramStep(draft, hasLocation) {
  const program = draft?.program || {};
  let remoteTypes = draft?.types || [];

  const {
    locations,
    inPerson,
    licenses,
    noLicense,
    accreditations,
    email,
    mobile,
    preferredContacts,
    paymentOptions,
    remote,
  } = program;

  if (isEmpty(program)) {
    return 1;
  }

  if ((!inPerson?.available || isEmpty(locations)) && !remote?.available) {
    return 2;
  }

  if (!hasLocation && isEmpty(remoteTypes)) {
    return 3;
  }

  if (hasLocation && isEmpty(first(locations).types) && inPerson.available) {
    return 4;
  }

  if (hasLocation && isEmpty(first(locations).photos)) {
    return 5;
  }

  if (isEmpty(email) || isEmpty(mobile) || isEmpty(preferredContacts)) {
    return hasLocation ? 6 : 4;
  }

  if (isEmpty(paymentOptions)) {
    return hasLocation ? 7 : 5;
  }

  if (isEmpty(licenses) && isEmpty(noLicense) && isEmpty(accreditations)) {
    return hasLocation ? 8 : 6;
  }

  return hasLocation ? 9 : 7;
}
