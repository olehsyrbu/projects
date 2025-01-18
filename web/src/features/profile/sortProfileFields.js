export function sortProfileFields(organization, profile, searchParams) {
  let searchedCodes = Object.values(searchParams.query).flatMap((value) =>
    Array.isArray(value) ? value : [],
  );

  let bySearchParams = (itemA, itemB) => {
    let indexA = searchedCodes.includes(itemA.code) ? 1 : 0;
    let indexB = searchedCodes.includes(itemB.code) ? 1 : 0;
    return indexA === indexB ? byName(itemA, itemB) : indexA - indexB;
  };

  profile.ageGroups?.sort(byOrder);
  profile.specialGroups?.sort(bySearchParams);
  profile.networkInsurance?.sort(bySearchParams);
  profile.paymentMethods?.sort(bySearchParams);
  profile.treatments?.sort(bySearchParams);
  profile.modalities?.sort(bySearchParams);
  profile.providerTypes?.sort((typeA, typeB) =>
    bySearchParams(typeA.providerType, typeB.providerType),
  );
  profile.genders?.sort(bySearchParams);
  profile.accommodation?.sort(bySearchParams);
  profile.religions?.sort(bySearchParams);
  profile.ethnicities?.sort(bySearchParams);
  profile.specialties?.sort(bySearchParams);
  profile.sexualIdentities?.sort(bySearchParams);
  profile.amenities?.sort(bySearchParams);
  profile.dietaryAccommodations?.sort(bySearchParams);

  if (organization?.insuranceTypes?.length > 0) {
    let insuranceTypeCodes = organization.insuranceTypes.map((type) => type.code);

    profile.insuranceTypes?.sort((itypeA, itypeB) => {
      let indexA = insuranceTypeCodes.includes(itypeA.code) ? 1 : 0;
      let indexB = insuranceTypeCodes.includes(itypeB.code) ? 1 : 0;
      return indexB - indexA;
    });
  }

  return profile;
}

function byName(itemA, itemB) {
  return itemA.name.localeCompare(itemB.name);
}

function byOrder(itemA, itemB) {
  return itemA.order - itemB.order;
}
