export function getEventProperties(profile) {
  let { status, mode, slug, email, mobile, providerTypes, updatedAt } = profile;

  let common = {
    status,
    providerSlug: slug,
    mode,
    email,
    phone: mobile,
    providerUpdatedAt: updatedAt,
    providerTypes: providerTypes?.map(({ providerType }) => providerType.code),
  };

  if (mode === 'PERSON') {
    let { legalFirstName, legalLastName, nationalProviderIdentifier } = profile;
    return {
      ...common,
      firstName: legalFirstName,
      lastName: legalLastName,
      npi: nationalProviderIdentifier,
    };
  }

  if (mode === 'PROGRAM') {
    let { programType, name, center, admissionPhone } = profile;
    return { ...common, name, center, admissionPhone, programType: programType?.code };
  }

  return common;
}
