export function getProgramCompletion(program) {
  const general = getGeneralCompletion(program);
  const audience = getAudienceCompletion(program);
  const services = getServicesCompletion(program);
  const location = getLocationCompletion(program);
  const gallery = getGalleryCompletion(program);
  const payment = getPaymentCompletion(program);
  const schedule = getScheduleCompletion(program);

  const totalCompletion = Math.floor(
    (general + audience + services + location + gallery + payment + schedule) / 7,
  );

  return { general, audience, services, location, gallery, payment, schedule, totalCompletion };
}

function getPercent(block) {
  return Math.floor((block.filter(Boolean).length / block.length) * 100);
}

function getGeneralCompletion(program) {
  const general = [
    program.name?.length,
    program.tagLine?.length,
    program.photoUrl?.length,
    program.description?.length,
    program.center?.length,
  ];
  return getPercent(general);
}

function getAudienceCompletion(program) {
  const audience = [
    program.requiredTherapeuticAreas?.length > 0,
    program.excludedTherapeuticAreas?.length > 0,
    program.therapeuticAreas?.length > 0,
    program.ageGroups?.length > 0,
    program.genders?.length > 0,
    program.ethnicities?.length > 0,
    program.sexualIdentities?.length > 0,
    program.religions?.length > 0,
    program.specialGroups?.length > 0,
    program.matchesAllConditionsFrom,
  ];
  return getPercent(audience);
}

function getServicesCompletion(program) {
  const services = [
    program.providerTypes?.length > 0,
    program.therapyTypes?.length > 0,
    program.services?.length > 0,
    program.treatmentTypes?.length > 0,
    program.languageServices?.length > 0,
    program.licenses?.length > 0 ||
      program.accreditations?.length > 0 ||
      program.noLicense?.length > 0,
    program.certifications?.length > 0,
  ];
  return getPercent(services);
}

function getLocationCompletion(program) {
  if (program.remote?.available && !program.inPerson.available) {
    const remote = [
      program.remote?.available,
      program.remote?.states?.length > 0,
      program.remote?.accommodations?.length > 0,
    ];
    return getPercent(remote);
  }
  const programFirstLocation = program.locations ? program.locations[0] : [];
  const location = [
    programFirstLocation?.address?.address1,
    programFirstLocation?.name,
    programFirstLocation?.facilityType?.name,
    programFirstLocation?.dietaryAccommodation?.name,
    programFirstLocation?.amenities?.filter(({ category }) => category === 'Facilities')?.length >
      0,
    programFirstLocation?.accommodations?.length > 0,
  ];
  return getPercent(location);
}

function getGalleryCompletion(program) {
  const PHOTOS_MAX_LENGTH = 6;
  const photosLength =
    program.locations && program.locations[0]?.photos ? program.locations[0]?.photos?.length : 0;
  return (photosLength / PHOTOS_MAX_LENGTH) * 100;
}

function getPaymentCompletion(program) {
  const cost = program.sessionCostLow > 0 && program.sessionCostHigh > 0;
  const payment = [program.paymentMethods?.length, program.paymentOptions?.length, cost];
  return getPercent(payment);
}

function getScheduleCompletion(program) {
  const schedule = [
    program.email?.length,
    program.mobile?.length,
    program.admissionPhone?.length,
    program.onlineScheduler?.length,
    program.website?.length,
    program.duration?.averageTotalHours,
    program.availability?.is247 || program.availability?.hours?.length,
  ];
  return getPercent(schedule);
}
