import { gql } from 'graphql-request';
import { ReferenceDataFragment } from '@/core/api/ReferenceDataAPI';
import { StateFragment } from '@/core/api/StatesAPI';
import { PhotoFragment } from './Photo';
import { ProviderLocationFragment } from './Location';

export const ProviderCommonProfileFragment = gql`
  fragment ProviderCommonProfile on Provider {
    mode
    id
    slug
    status
    email
    mobile
    admissionPhone: admission_phone
    description
    active

    tagLine: tag_line
    onlineScheduler: online_scheduler
    preferredContacts: preferred_contacts

    remote {
      available
      voice
      chat
      video
      states {
        ...State
      }
    }

    inPerson: in_person {
      available
    }

    availability {
      updated_at
      status
      afterHoursCrisisServices: after_hours_crisis_services
      intakeWaitDays: intake_wait_days
      is247: is_24_7
      hours {
        day
        start
        end
      }
    }

    religions {
      ...ReferenceData
    }
    ethnicities {
      ...ReferenceData
    }
    genders {
      ...ReferenceData
    }
    sexualIdentities: sexual_identities {
      ...ReferenceData
    }
    ageGroups: age_groups {
      ...ReferenceData
    }
    therapyTypes: therapies {
      ...ReferenceData
    }
    treatmentTypes: treatments {
      ...ReferenceData
    }
    requiredTherapeuticAreas: required_therapeutic_areas {
      ...ReferenceData
    }
    excludedTherapeuticAreas: excluded_therapeutic_areas {
      ...ReferenceData
    }

    matchesAllConditionsFrom: matches_all_conditions_from

    treatsMedicallyUnstable: treats_medically_unstable
    canAssistWithDailyLiving: can_assist_with_daily_living
    treatsSuicidalIdeation: treats_suicidal_ideation

    therapeuticAreas: therapeutic_areas {
      favorite
      therapeuticArea: therapeutic_area {
        ...ReferenceData
      }
    }
    providerTypes: provider_types {
      favorite
      providerType: provider_type {
        ...ReferenceData
      }
    }

    noLicense: no_license {
      comment
      noLicenseReason: no_license_reason {
        ...ReferenceData
      }
      state {
        ...State
      }
    }
    licenses {
      id
      organization
      name
      number
      state {
        ...State
      }
      isSupervisorLicense: is_supervisor_license
      expiredAt: expired_at
      type
    }

    certifications {
      id
      authority
      name
      description
    }

    languageServices: language_services {
      ...ReferenceData
    }

    insuranceTypes: insurance_types {
      ...ReferenceData
    }
    onlinePaymentUrl: online_payment_url
    paymentOptions: payment_options {
      ...ReferenceData
    }
    paymentMethods: payment_methods {
      ...ReferenceData
    }
    sessionCostLow: session_cost_low
    sessionCostHigh: session_cost_high
    sessionCostTime: session_cost_time {
      ...ReferenceData
    }
    photoUrl: photo_url
    specialGroups: special_groups {
      ...ReferenceData
    }
    timezone
    updatedAt: updated_at
    createdAt: created_at
    onboardedAt: onboarded_at
    website
    otherAudienceCriteria: other_audience_criteria
    organizations {
      id
      subdomain
      name
    }
  }
`;

const ProviderPersonOnlyProfileFragment = gql`
  fragment ProviderPersonOnlyProfile on Provider {
    legalFirstName: legal_first_name
    legalLastName: legal_last_name
    legalName: legal_name
    preferredFirstName: preferred_first_name

    canPrescribeMedication: can_prescribe_medication
    freeInPersonConsultation: free_in_person_consultation
    emergencyContactAvailable: emergency_contact_available

    gpa {
      name
      email
    }
    invitation {
      id
      email
      status
      invitationCode: invitation_code
      sentAt: sent_at
    }
    pronoun {
      ...ReferenceData
    }
    rainbowMember: rainbow_member
    educations {
      id
      comment
      schoolName: school_name
      graduationYear: graduation_year
      education {
        ...ReferenceData
      }
    }
    publications {
      id
      title
      description
      doi
      publicationDate: publication_date
      publicationIn: publication_in
      url
    }
    deactivation {
      deactivated_at
      reason
      organization {
        id
        name
        subdomain
      }
    }
    organizations {
      id
      subdomain
      name
    }
    sharedWith: shared_with {
      id
      email
      name
      type: __typename
    }
    locations {
      ...ProviderLocation
    }
    experience
    nationalProviderIdentifier: national_provider_identifier
  }
`;

export let ProviderPersonProfileFragment = gql`
  fragment Provider on Provider {
    ...ProviderCommonProfile
    ...ProviderPersonOnlyProfile
  }

  ${ProviderCommonProfileFragment}
  ${ProviderPersonOnlyProfileFragment}

  ${ProviderLocationFragment}
  ${PhotoFragment}
  ${ReferenceDataFragment}
  ${StateFragment}
`;
