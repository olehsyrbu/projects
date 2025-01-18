import { ROLE_NAMES } from '@/core/definitions';

const ONBOARDING_TEXTS = {
  [ROLE_NAMES.PROVIDER]: {
    1: {
      title: 'Join our community! Fill out this form in less than 5 minutes.',
      subTitlePreferredName: 'We ask for your legal name to verify your license information',
      nameTitle: 'We ask for your legal name to verify your license information',
      nationalIdentifierTitle: 'National Provider Identifier (NPI)',
      nationalIdentifierTooltip:
        "The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won't be publicly displayed. Blue Cross Blue Shield will use it to determine eligibility for their Quality Based Reimbursement Program (QBRP).",
    },
    2: {
      title: 'How are you currently offering your services?',
      titleLicense: 'Please add your primary location, if you have multiple you can add them later',
      titleGroupPractice: 'If you are part of a group practice, you can include the name here',
      titleHideAddress: 'Hide full address in search',
      textAccommodationHint: 'Please check any accommodations you offer (optional)',
      textRemote: 'How do you deliver remote care?',
    },
    3: {
      title: 'Tells us a little bit more about your expertise',
      subTitle: 'This helps us match you with clients in your areas of expertise.',
      textSuicidal: 'I accept clients/patients who are actively suicidal',
      textPrescribe: 'I prescribe medication',
      textAreas: 'Areas of expertise',
      textAreasHint: 'Please select all the areas you are competent to practice.',
      textAge: 'Age groups you treat',
    },
    4: {
      title: 'What’s your current availability?',
      subTitle: 'You can always change this later and add more details about your availability.',
      textTitleBanner: "You did it! You've completed the first part of your profile.",
      textSubTitleBanner: 'Now get your license, a photo, and accepted payment methods ready.',
      textAfterHoursCrisisServices: 'I provide after-hour crisis services',
    },
    5: {
      title: 'How would you like prospective clients/patients to contact you?',
      subTitle:
        'We will only display on your profile the methods you select as preferred for patients/clients to contact you.',
      emailText:
        'If you click preferred, clients/patients will be able to contact you directly through MiResource.',
    },
    6: {
      title: 'Add your license information',
      subTitle:
        'You are required to add at least one license or provide a reason for not having one.',
      textPsypactLicense: 'I am a PSYPACT Provider',
      textSuperLicense:
        'I am under supervision, so I will list my supervisor’s license information',
      textNoLicense: "I don't have a license",
      textNoLicenseReason: 'Please elaborate on the reason for not having a license',
    },
    7: {
      title: 'Which forms of payment do you support?',
      subTitle: 'Select all that apply to your practice',
      titleInsurance: 'List insurance companies you are in-network with',
    },
    8: {
      title: 'Last step – add a photo and tagline',
      subTitle:
        'We have found that prospective clients/patients are 90% more likely to reach out if you have photos. You can always add more later.',
      textPhoto: 'Drag your photo here or',
      textCropPhoto: 'Crop your profile picture',
      textTagLine:
        'A short introduction to your practice that will be displayed next to your name in search results. You can add a more detailed description of your practice once you have submitted your profile.',
    },
  },
  [ROLE_NAMES.GPA]: {
    1: {
      title: 'Let’s enter a provider’s profile information ',
      subTitlePreferredName: 'Provider’s preferred first name will be displayed on their profile.',
      nameTitle: 'Provider’s legal name to verify their license information',
      nationalIdentifierTitle: 'National Provider Identifier (NPI)',
      nationalIdentifierTooltip:
        "The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won't be publicly displayed. Blue Cross Blue Shield will use it to determine eligibility for their Quality Based Reimbursement Program (QBRP).",
    },
    2: {
      title: 'How is the provider currently offering their services?',
      titleLicense: 'If the provider has multiple locations they can be added later.',
      titleGroupPractice: 'Include the name of your group practice here',
      titleHideAddress:
        'Hide group practice’s entire address from appearing during client searches',
      textAccommodationHint: 'Please check any accommodations the provider offers (optional)',
      textRemote: 'How does the provider deliver remote care?',
    },
    3: {
      title: 'Tells us a little bit more about the provider’s specialty areas',
      subTitle:
        'This information helps us match the provider with clients/patients in their areas of expertise.',
      textSuicidal: 'The provider accepts clients who are actively suicidal',
      textPrescribe: 'The provider prescribes medication',
      textAreas: 'Provider’s areas of expertise',
      textAreasHint: 'You can add more later',
      textAge: 'Age groups provider treats',
    },
    4: {
      title: 'What is the provider’s current availability?',
      subTitle: 'You can always change this later and add more details about their availability.',
      textTitleBanner: 'You did it! You’ve completed the first part of the provider’s profile?',
      textSubTitleBanner: 'Now get their license, a photo, and accepted payment methods ready.',
      textAfterHoursCrisisServices: 'Provider provides after-hour crisis services',
    },
    5: {
      title: 'How would you like prospective clients/patients to contact your provider? ',
      subTitle:
        'This information will be displayed publicly on the provider’s profile and will be indicated to clients/patients as the best way to contact your provider.',
      emailText:
        'If you make this the preferred method of contact for the provider, clients/patients will be able to contact them directly through MiResource.',
    },
    6: {
      title: 'Add license information',
      subTitle:
        'The provider is required to have at least one license or a reason is needed for them not having one. ',
      textPsypactLicense: 'I am a PSYPACT Provider',
      textSuperLicense:
        'Provider is under supervision, so I will list supervisor’s license information',
      textNoLicense: 'The provider does not have a license',
      textNoLicenseReason: 'Please elaborate on the reason for provider not having a license',
    },
    7: {
      title: 'Which forms of payment does the provider support?',
      subTitle: 'Select all that apply to your group practice',
      titleInsurance: 'List insurance companies the provider is in-network with',
    },
    8: {
      title: 'Add a photo and tagline',
      subTitle:
        'We have found that prospective clients/patients are 90% more likely to reach out if the provider has a photo.',
      textPhoto: 'Drag provider photo here or',
      textCropPhoto: 'Crop your profile picture',
      textTagLine:
        'A short introduction to the provider’s profile that will be displayed next to the provider’s name in search results. A more detailed description of the provider can be added once the provider’s profile is submitted. You may mention the group practice here and in the more detailed description. ',
    },
  },
};

export function getOboadringText({ role, step = 1 }) {
  return ONBOARDING_TEXTS[role][step];
}
