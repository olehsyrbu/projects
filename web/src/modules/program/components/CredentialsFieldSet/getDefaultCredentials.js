export function getDefaultCredentials({ accreditations, licenses, noLicense }) {
  const hasAccreditations = accreditations.length > 0;
  const hasLicences = licenses?.length > 0;
  return {
    isAccreditationChecked: hasAccreditations,
    isLicenseChecked: hasLicences,
    noLicense: noLicense ? noLicense : undefined,
    accreditations: hasAccreditations
      ? accreditations
      : [{ body: '', accreditedAt: '', expiredAt: '' }],
    licenses:
      licenses.length > 0
        ? licenses
        : [
            {
              organization: '',
              name: '',
              number: '',
              state: undefined,
              expiredAt: '',
            },
          ],
  };
}
