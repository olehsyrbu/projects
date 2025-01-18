export const visibilityFixtures = {
  defaultActivityWithExpressions() {
    return {
      id: 'activity/62b21979b90b7f2ba9e1c47c',
      name: {
        en: 'Columbia Suicide Severity Scale',
      },
      description: {
        en: 'Risk of Harm',
      },
      schemaVersion: {
        en: '0.0.1',
      },
      version: {
        en: '0.0.1',
      },
      altLabel: {
        en: 'Columbia Suicide Severity Scale',
      },
      shuffle: false,
      skippable: false,
      backDisabled: false,
      fullScreen: false,
      autoAdvance: false,
      isPrize: false,
      subScales: [
        {
          jsExpression: 'q1 + q2 + q3 + q4 + q5 + q6',
          variableName: 'c-ssrs',
        },
      ],
      preamble: {
        en: '',
      },
      addProperties: [
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q1',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@value': true,
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q1',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q2',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@value': true,
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q2',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q3',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@language': 'en',
              '@value': 'q2 == 1',
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q3',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q4',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@language': 'en',
              '@value': 'q2 == 1',
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q4',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q5',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@language': 'en',
              '@value': 'q2 == 1',
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q5',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q6',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@value': true,
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q6',
            },
          ],
        },
        {
          'reprolib:terms/isAbout': [
            {
              '@id': 'q7',
            },
          ],
          'reprolib:terms/isVis': [
            {
              '@value': true,
            },
          ],
          'reprolib:terms/variableName': [
            {
              '@language': 'en',
              '@value': 'q7',
            },
          ],
        },
      ],
      order: [
        '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c496',
        '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c497',
        '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c498',
        '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c499',
        '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c49a',
        '62b21979b90b7f2ba9e1c47c/62b2197fb90b7f2ba9e1c49b',
        '62b21979b90b7f2ba9e1c47c/62ba0766acd35a1054f0cf5f',
      ],
      notification: {},
      items: [
        {
          id: 'screen/62b2197eb90b7f2ba9e1c496',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q1',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past month,\n\nHave you wished you were dead or wished you could go to sleep and not wake up?',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c496',
          variableName: 'q1',
          visibility: true,
        },
        {
          id: 'screen/62b2197eb90b7f2ba9e1c497',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q2',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past month,\n\nHave you had any actual thoughts of killing yourself?',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c497',
          variableName: 'q2',
          visibility: true,
        },
        {
          id: 'screen/62b2197eb90b7f2ba9e1c498',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q3',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past month,\n\nHave you been thinking about how you might kill yourself?',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c498',
          variableName: 'q3',
          visibility: 'q2 == 1',
        },
        {
          id: 'screen/62b2197eb90b7f2ba9e1c499',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q4',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past month,\n\nHave you had these thoughts and had some intention of acting on them?',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c499',
          variableName: 'q4',
          visibility: 'q2 == 1',
        },
        {
          id: 'screen/62b2197eb90b7f2ba9e1c49a',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q5',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past month,\n\nHave you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197eb90b7f2ba9e1c49a',
          variableName: 'q5',
          visibility: 'q2 == 1',
        },
        {
          id: 'screen/62b2197fb90b7f2ba9e1c49b',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q6',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In the past 3 months,\n\nHave you ever done anything, started to do anything, or prepared to do anything with any intent to die?\n\n*Examples: Collected pills, obtained a gun, gave away valuables, wrote a will or suicide note, held a gun but changed your mind, cut yourself, tried to hang yourself, etc.*',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62b2197fb90b7f2ba9e1c49b',
          variableName: 'q6',
          visibility: true,
        },
        {
          id: 'screen/62ba0766acd35a1054f0cf5f',
          description: {
            en: '',
          },
          schemaVersion: {
            en: '0.0.1',
          },
          version: {
            en: '0.0.1',
          },
          altLabel: {
            en: 'q7',
          },
          inputType: 'radio',
          isOptionalText: false,
          question: {
            en: 'In your entire life,\n\nHave you ever done anything, started to do anything, or prepared to do anything with any intent to die?\n\n*Examples: Collected pills, obtained a gun, gave away valuables, wrote a will or suicide note, held a gun but changed your mind, cut yourself, tried to hang yourself, etc.*',
          },
          timer: 0,
          valueConstraints: {
            enableNegativeTokens: false,
            multipleChoice: false,
            randomizeOptions: false,
            responseAlert: false,
            scoring: true,
            valueType: 'http://www.w3.org/2001/XMLSchema#anyURI',
            itemList: [
              {
                name: {
                  en: 'No',
                },
                value: 0,
                score: 0,
                description: '',
              },
              {
                name: {
                  en: 'Yes',
                },
                value: 1,
                score: 1,
                description: '',
              },
            ],
            maxValue: 2,
            minValue: 1,
            isOptionalText: false,
          },
          fullScreen: false,
          backDisabled: false,
          autoAdvance: true,
          inputs: {},
          schema: '62b21979b90b7f2ba9e1c47c/62ba0766acd35a1054f0cf5f',
          variableName: 'q7',
          visibility: true,
        },
      ],
      schema: '62b21979b90b7f2ba9e1c47c',
    };
  },
};
