export function getOnboardingStep(provider) {
  const {
    legalFirstName,
    inPerson,
    remote,
    providerTypes,
    availability,
    email,
    mobile,
    preferredContacts,
    paymentOptions,
    licenses,
    noLicense,
    photoUrl,
    tagLine,
    nationalProviderIdentifier,
  } = provider || {};

  if (!legalFirstName || nationalProviderIdentifier === '') {
    return 1;
  }

  if (!inPerson?.available && !remote?.available) {
    return 2;
  }

  if (!providerTypes?.length) {
    return 3;
  }

  if (!availability) {
    return 4;
  }

  if (!email || !mobile || !preferredContacts?.length) {
    return 5;
  }

  if (licenses.length === 0 && !noLicense?.length) {
    return 6;
  }

  if (!paymentOptions?.length) {
    return 7;
  }

  if (!photoUrl || !tagLine) {
    return 8;
  }
  return 9;
}
