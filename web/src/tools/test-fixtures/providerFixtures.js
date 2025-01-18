export const providerFixtures = {
  defaultProviderForTeamNotes() {
    return {
      id: 'some-provider-id-1',
    };
  },
  defaultProviderList() {
    return [
      {
        id: '8fcf7831-9c05-4360-8001-3735d53c32a6',
        slug: 'auto-provider-N85K',
        status: 'COMPLETED',
        email: 'auto-test-provider@tempr.email',
        mobile: '5417543010',
        tagLine: 'Very good guy.',
        onlineScheduler: 'https://beta.miresource.com/',
        preferredContacts: ['MOBILE'],
        legalFirstName: 'Auto',
        legalLastName: 'Provider',
        preferredFirstName: 'Auto',
        canPrescribeMedication: true,
        description: 'jhkjhkjhkjkhj',
        active: true,
        religions: [
          {
            id: '3b6802cb-b2f4-480c-aa47-619a52333fd2',
            code: 'ATH',
            name: 'Atheism',
            category: null,
            description: null,
          },
        ],
        ethnicities: [
          {
            id: 'f8afde40-78cf-41f7-839a-7967104b7c37',
            code: 'AES',
            name: 'Asian (East/Southeast)',
            category: null,
            description: null,
          },
        ],
        genders: [],
        pronoun: null,
        rainbowMember: false,
        ageGroups: [
          {
            id: '85289070-9148-4ee4-8fdf-efae2d391a91',
            code: 'PRE',
            name: 'Preteens (10-12)',
            category: null,
            description: 'Preteen',
          },
        ],
        therapyTypes: [
          {
            id: '3c38a955-02dd-4860-8bf2-4cdfd3d12f40',
            code: 'ASSEVAL',
            name: 'Assessment/Evaluation',
            category: null,
            description: null,
          },
        ],
        treatmentTypes: [
          {
            id: '3e445a30-031b-4a60-b54c-90e1b0e7d9f2',
            code: 'AD',
            name: 'Adlerian',
            category: null,
            description: null,
          },
          {
            id: '65e53c78-63b5-4574-b41a-7bb5a0f69a5a',
            code: 'ART',
            name: 'Aggression Replacement Training',
            category: null,
            description: null,
          },
          {
            id: '72d72fdd-eec8-4092-a531-3fb91b7a703b',
            code: 'ARTH',
            name: 'Accelerated Resolution Therapy',
            category: '',
            description: '',
          },
        ],
        excludedTherapeuticAreas: [
          {
            id: '4826e072-42cb-496b-bc6b-47e389e4891b',
            code: 'Abuse',
            name: 'Abuse',
            category: 'Trauma',
            description: 'Abuse',
          },
          {
            id: '1359042f-ee24-433f-9c0c-ba629b29e11d',
            code: 'ACAC',
            name: 'Academic Concerns',
            category: 'Academic and Career',
            description: 'Academic Concerns',
          },
          {
            id: 'f3b3ed32-2412-48e6-a00a-62e339bfec4a',
            code: 'Aging',
            name: 'Aging',
            category: 'Physical',
            description: 'Aging',
          },
        ],
        therapeuticAreas: [
          {
            favorite: true,
            therapeuticArea: {
              id: '4826e072-42cb-496b-bc6b-47e389e4891b',
              code: 'Abuse',
              name: 'Abuse',
              category: 'Trauma',
              description: 'Abuse',
            },
          },
          {
            favorite: true,
            therapeuticArea: {
              id: '1359042f-ee24-433f-9c0c-ba629b29e11d',
              code: 'ACAC',
              name: 'Academic Concerns',
              category: 'Academic and Career',
              description: 'Academic Concerns',
            },
          },
          {
            favorite: true,
            therapeuticArea: {
              id: '4af95124-3e4d-4a8c-8d51-8b1c3642a462',
              code: 'Adoption',
              name: 'Adoption',
              category: 'Relationships',
              description: 'Adoption',
            },
          },
          {
            favorite: true,
            therapeuticArea: {
              id: 'f3b3ed32-2412-48e6-a00a-62e339bfec4a',
              code: 'Aging',
              name: 'Aging',
              category: 'Physical',
              description: 'Aging',
            },
          },
          {
            favorite: true,
            therapeuticArea: {
              id: '105287fa-f8fa-437d-8fed-6761e4506a1e',
              code: 'SUB',
              name: 'Alcohol Use',
              category: 'Substance Use Disorders',
              description: null,
            },
          },
          {
            favorite: true,
            therapeuticArea: {
              id: 'e4cf7bf4-63db-4cee-beda-c84cdda94d61',
              code: 'ANX',
              name: 'Anxiety',
              category: 'Anxiety',
              description: 'Anxiety',
            },
          },
        ],
        providerTypes: [
          {
            favorite: true,
            providerType: {
              id: '3adb3bb3-c024-43a2-aa11-249c56459993',
              code: 'ACSW',
              name: 'Academy of Certified Social Workers License (ACSW)',
              category: null,
              description: null,
            },
          },
          {
            favorite: true,
            providerType: {
              id: 'af23c190-acdb-4ddd-96e4-3250d6b6a228',
              code: 'BCBA',
              name: 'Board Certified Behavior Analyst (BCBA)',
              category: null,
              description: null,
            },
          },
        ],
        noLicense: {
          comment: null,
          noLicenseReason: null,
        },
        licenses: [
          {
            organization: 'LCB',
            name: 'LCB',
            number: '123123123',
            state: {
              code: 'AK',
              name: 'Alaska',
              id: '727db5b7-a9d5-4076-b5e1-56b288788c18',
            },
            isSupervisorLicense: false,
            expiredAt: '12/11/2090',
          },
        ],
        certifications: [],
        educations: [
          {
            comment: '',
            schoolName: '1',
            graduationYear: 2004,
            education: {
              id: 'b71a6b22-a2b9-4911-b352-fab946baba21',
              code: 'BS',
              name: 'BS (Bachelor of Science)',
              category: null,
              description: null,
            },
          },
          {
            comment: null,
            schoolName: '1123',
            graduationYear: 2003,
            education: {
              id: 'd2a09df0-6cde-4f84-9c9d-31f204c9dad2',
              code: 'DO',
              name: 'DO (Doctor of Osteopathic Medicine)',
              category: null,
              description: null,
            },
          },
          {
            comment: null,
            schoolName: 'с',
            graduationYear: 2008,
            education: {
              id: 'd2a09df0-6cde-4f84-9c9d-31f204c9dad2',
              code: 'DO',
              name: 'DO (Doctor of Osteopathic Medicine)',
              category: null,
              description: null,
            },
          },
        ],
        publications: [],
        languageServices: [
          {
            id: 'a17691af-399f-411f-918d-48c40a402eae',
            code: 'BEN',
            name: 'Bengali',
            category: null,
            description: null,
          },
          {
            id: '4d5052c7-446e-4957-b384-677d6039161f',
            code: 'CANT',
            name: 'Cantonese',
            category: null,
            description: null,
          },
          {
            id: '3e6dc1f6-f628-4b21-ad79-80842b9a1892',
            code: 'DF',
            name: 'American Sign Language',
            category: null,
            description: null,
          },
        ],
        experience: null,
        insuranceTypes: [
          {
            id: '779df284-2fbf-4870-8ad4-a76ebf6cecb3',
            code: 'AHSA',
            name: 'Advanced Health Systems',
            category: 'Alabama',
            description: null,
          },
          {
            id: 'e313cafa-5665-4035-be74-f93f1f43f942',
            code: 'ALMA',
            name: 'AlaMed',
            category: 'Alabama',
            description: null,
          },
          {
            id: '40b28e93-6dcd-4c15-94c2-bf58a1257a2e',
            code: 'BCBSA',
            name: 'Blue Cross Blue Shield (BCBS)',
            category: 'Alabama',
            description: null,
          },
        ],
        paymentOptions: [
          {
            id: '7a3d59be-ed93-4497-b059-5c301259585e',
            code: 'infooutofnetwork',
            name: 'Information for out-of-network claims',
            category: null,
            description: null,
          },
          {
            id: '14b659c0-ce6c-4804-894a-7709289af442',
            code: 'insurance',
            name: 'In-network insurance',
            category: null,
            description: null,
          },
          {
            id: '1405e63b-2f50-42cd-ad7e-46e045bb077b',
            code: 'outofnetwork',
            name: 'Out-of-network reimbursement filing',
            category: 'Insurance Only',
            description: null,
          },
          {
            id: 'f102729e-fdad-47b3-bf47-05094de3a788',
            code: 'outofpocket',
            name: 'Out-of-pocket',
            category: null,
            description: null,
          },
        ],
        paymentMethods: [],
        sessionCostLow: 26,
        sessionCostHigh: 125,
        freeInPersonConsultation: false,
        remote: {
          available: true,
          voice: true,
          chat: true,
          video: true,
        },
        inPerson: {
          available: true,
        },
        availability: {
          updated_at: '2021-10-27T09:14:19.169Z',
          status: 'ACCEPTING_NEW_CLIENTS',
          afterHoursCrisisServices: false,
          intakeWaitDays: 0,
          hours: [
            {
              day: 'SUNDAY',
              start: '00:15:00',
              end: '01:00:00',
            },
          ],
        },
        photoUrl:
          'https://assets.dev.miresource.io/p/60df3193d76e33001378a97a/vlSb6vXpVG7agYyTJLYTtfT5CLazjs4R.png',
        specialGroups: [
          {
            id: '21ab8814-79de-4f3b-9b5a-1b0769977474',
            code: 'BP',
            name: 'Body positivity',
            category: null,
            description: null,
          },
        ],
        timezone: 'Europe/Kiev',
        locations: [
          {
            name: null,
            address: {
              state: {
                code: 'CA',
                name: 'California',
                id: '586f0c71-58a1-4f46-b4bd-738583f4a4da',
              },
              address: '2800 North Main Street',
              address1: 'somewhere',
              city: 'Los Angeles',
              zipCode: '90031',
              coordinates: {
                coordinates: [-118.2127327, 34.065898],
              },
            },
            phone: null,
            hide: false,
            facilityType: null,
            accommodations: [
              {
                id: '01d4a6b1-24ea-41d9-a59d-3445bde2dea7',
                code: 'signlanguage',
                name: 'Sign language interpreter',
                category: 'Communication',
                description: null,
              },
              {
                id: '292db8d7-b2d4-477a-a7fc-9c95cba9b906',
                code: 'elevators',
                name: 'Elevators',
                category: 'Getting around',
                description: null,
              },
              {
                id: '1c32a82e-8793-4ad8-93fa-5cf2cb545213',
                code: 'listeningdevice',
                name: 'Assisted listening device',
                category: 'Communication',
                description: null,
              },
              {
                id: '4a6f3e11-e116-446d-aec5-9671dc899332',
                code: 'dooropenedeasily',
                name: 'Door can be opened easily',
                category: 'Entering the practice',
                description: null,
              },
            ],
          },
          {
            name: 'New Location',
            address: {
              state: {
                code: 'AK',
                name: 'Alaska',
                id: '727db5b7-a9d5-4076-b5e1-56b288788c18',
              },
              address: 'Home',
              address1: '1123',
              city: 'New York',
              zipCode: '12312',
              coordinates: null,
            },
            phone: null,
            hide: false,
            facilityType: null,
            accommodations: [
              {
                id: '1c32a82e-8793-4ad8-93fa-5cf2cb545213',
                code: 'listeningdevice',
                name: 'Assisted listening device',
                category: 'Communication',
                description: null,
              },
              {
                id: '4a6f3e11-e116-446d-aec5-9671dc899332',
                code: 'dooropenedeasily',
                name: 'Door can be opened easily',
                category: 'Entering the practice',
                description: null,
              },
            ],
          },
        ],
        deactivation: [],
      },
    ];
  },
};
