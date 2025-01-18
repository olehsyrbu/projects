import { isUndefined, first } from 'lodash-es';

export function getProfileCompletion(profile) {
  const general = getGeneralCompletion(profile);
  const specialty = getSpecialtyCompletion(profile);
  const credentials = getCredentialsCompletion(profile);
  const payment = getPaymentCompletion(profile);
  const location = getLocationCompletion(profile);
  const schedule = getScheduleCompletion(profile);
  const totalCompletion = Math.floor(
    (general + location + specialty + credentials + payment + schedule) / 6,
  );

  return { general, specialty, location, credentials, payment, schedule, totalCompletion };
}

function getPercent(block) {
  return Math.floor((block.filter(Boolean).length / block.length) * 100);
}

function getGeneralCompletion(profile) {
  let general = [
    profile.legalFirstName?.length,
    profile.legalLastName?.length,
    profile.preferredFirstName?.length,
    profile.photoUrl?.length,
    profile.tagLine?.length,
    profile.pronoun && profile.pronoun.code && profile.pronoun.name,
    profile.description?.length,
    profile.genders?.length,
    profile.ethnicities?.length,
    profile.religions?.length,
    profile.website?.length,
  ];

  if (!isUndefined(profile.nationalProviderIdentifier)) {
    general.push(profile.nationalProviderIdentifier?.length);
  }
  return getPercent(general);
}

function getLocationCompletion(profile) {
  if (profile.remote?.available && !profile.inPerson?.available) {
    return 100;
  }

  const profileFirstLocation = profile.locations ? profile.locations[0] : [];
  const location = [
    profileFirstLocation?.name,
    profileFirstLocation?.facilityType?.name,
    profileFirstLocation?.accommodations?.length > 0,
  ];
  return getPercent(location);
}

function getSpecialtyCompletion(profile) {
  const specialty = [
    profile.therapeuticAreas?.length > 0,
    profile.ageGroups?.length > 0,
    profile.excludedTherapeuticAreas?.length > 0,
    profile.therapyTypes?.length > 0,
    profile.treatmentTypes?.length > 0,
    profile.languageServices?.length > 0,
    profile.specialGroups?.length > 0,
  ];

  return getPercent(specialty);
}

function getCredentialsCompletion(profile) {
  const firstNoLicense = first(profile.noLicense);
  const isHasNoLicense =
    profile.noLicense &&
    firstNoLicense &&
    firstNoLicense?.noLicenseReason?.code &&
    firstNoLicense?.noLicenseReason?.name;

  const credentials = [
    profile.providerTypes?.length,
    (profile.licenses && profile.licenses?.length) || isHasNoLicense,
    profile.experience,
    profile.certifications?.length,
    profile.educations?.length,
    profile.publications?.length,
  ];

  return getPercent(credentials);
}

function getPaymentCompletion(profile) {
  const cost = profile.sessionCostLow > 0 && profile.sessionCostHigh > 0;
  const payment = [profile.paymentMethods?.length, profile.paymentOptions?.length, cost];
  return getPercent(payment);
}

function getScheduleCompletion(profile) {
  const schedule = [
    profile.email?.length,
    profile.mobile?.length,
    profile.onlineScheduler?.length,
    profile.availability?.hours?.length,
  ];
  return getPercent(schedule);
}
