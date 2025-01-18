import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { isUndefined } from 'lodash-es';
import mixpanel from '@/core/mixpanel';
import { logger } from '@/core/logger';
import { TooltipIcon } from '@/core/components/Tooltip';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { TextField } from '@/modules/form';
import { useSurvey } from '@/modules/survey/hooks';
import { useOrganization } from '@/modules/organization';
import { useAuthContext } from '@/modules/auth';
import { getIsRoleGPA, getIsRoleProvider, getOboadringText } from '../utils';
import { usePersonOnBoarding } from '../hooks';

const schema = object().shape({
  legalFirstName: string().required('This field is required'),
  legalLastName: string().required('This field is required'),
  nationalProviderIdentifier: string()
    .test('is-required-check', 'This field is required', (value) => value !== '')
    .matches(/^\d{10}$/, {
      message: '10-digit number format is required',
      excludeEmptyString: true,
    }),
});

export function OnboardingProviderGeneralInfo() {
  let survey = useSurvey();
  let organization = useOrganization();
  const { provider, doStepNext, updateProvider, role } = usePersonOnBoarding();
  const texts = getOboadringText({ role, step: survey.step });

  const providerRole = getIsRoleProvider(role);
  let {
    user: { firstName, lastName },
  } = useAuthContext();

  let {
    handleSubmit,
    control,
    formState: { isSubmitted, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      legalFirstName: providerRole ? provider.legalFirstName || firstName : provider.legalFirstName,
      legalLastName: providerRole ? provider.legalLastName || lastName : provider.legalLastName,
      preferredFirstName: provider.preferredFirstName,
      nationalProviderIdentifier: provider.nationalProviderIdentifier,
    },
  });

  async function submit(data) {
    try {
      let newProvider;
      newProvider = await updateProvider(data);
      mixpanel.track('Step 1 submitted');

      const isRoleGPA = getIsRoleGPA(role);
      if (isRoleGPA) {
        let id = newProvider?.id || provider?.id;
        const path = '/group-practice/resources';

        doStepNext({
          currentStep: 2,
          historyStep: `${path}/onboarding/${id}/step-2`,
          provider: newProvider || provider,
        });
      } else {
        survey.navigateNext();
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="font-sans !text-2xl font-bold">{texts.title}</h1>

      {providerRole && (
        <div className="mb-6 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-[800px]">
          <Info className="text-p-75" />
          <p className="flex-1 leading-6">
            This helps us match you with clients in your areas of expertise. If you need help,
            please reach out to
            <a
              className="inline-flex text-p-75 md:pl-2"
              href="mailto:support@miresource.com"
              type="email"
            >
              support@miresource.com.
            </a>
          </p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <fieldset className="md:w-[440px]">
          <legend>{texts.nameTitle}</legend>
          <div className="space-y-4">
            <TextField label="Legal First Name" name="legalFirstName" control={control} />
            <TextField label="Legal Last Name" name="legalLastName" control={control} />
            <TextField
              label="Preferred First Name (optional)"
              name="preferredFirstName"
              control={control}
            />
          </div>
        </fieldset>
        {!isUndefined(provider?.nationalProviderIdentifier) && (
          <div className="border-bottom mb-6 pb-6">
            <div className="!mb-4 flex items-center space-x-2">
              <legend className="!mb-0">National Provider Identifier (NPI)</legend>
              <TooltipIcon
                label={
                  organization?.subdomain === 'bcbsks'
                    ? "The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won't be publicly displayed. Blue Cross Blue Shield will use it to determine eligibility for their Quality Based Reimbursement Program (QBRP)."
                    : 'The NPI is a unique 10-digit identification number for in-network healthcare providers, created to help send health information electronically more effectively. It won’t be publicly displayed.'
                }
              />
            </div>

            <TextField
              className="sm:!w-64"
              label="Number"
              name="nationalProviderIdentifier"
              maxLength={10}
              inputMode="numeric"
              control={control}
            />
          </div>
        )}
        <SurveyStepControls
          disabled={isSubmitted && !isValid}
          hasBackControl={false}
          handleBack={false}
        />
      </form>
    </article>
  );
}
