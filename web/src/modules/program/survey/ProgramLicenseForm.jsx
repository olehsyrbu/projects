import { useForm } from 'react-hook-form';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import { logger } from '@/core/logger';
import { array, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { Info24Filled as Info, Warning16Regular as WarningIcon } from '@fluentui/react-icons';
import { CredentialsFieldSet, InlineAddress } from '@/modules/program';
import { Details, Summary } from '@/features/guided-search/components/Details';
import { TooltipIcon } from '@/core/components/Tooltip';
import { isEmpty } from 'lodash-es';
import { Alert } from '@/core/components';
import { get, uniqBy } from 'lodash-es';

const schema = object({
  credentials: array().of(CredentialsFieldSet.schema()),
});

export function ProgramLicenseForm({ program, onSubmit }) {
  const { remote, locations } = program;
  const remoteStates = remote?.states || [];
  const credentials = uniqBy([...getCredentialsFromLocation(locations), ...remoteStates], 'id');
  let {
    handleSubmit,
    formState: { isDirty, errors },
    control,
  } = useForm({
    defaultValues: {
      credentials: credentials.map((state) => CredentialsFieldSet.toFormValue({ state, program })),
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  function getCredentialsFromLocation(locations) {
    return locations.map(({ address }) => ({ ...address.state }));
  }

  async function submit({ credentials }) {
    try {
      let program;
      if (isDirty) {
        program = CredentialsFieldSet.toValueApi(credentials);
      }
      await onSubmit(program);
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1 className="flex items-center gap-x-2 font-sans !text-2xl">
        Add accreditation/license information
        <TooltipIcon label="Please select at least one accreditation/license type or provide a reason for not having one." />
      </h1>
      <div className="mb-2 box-border flex max-w-max items-center space-x-4 rounded-lg bg-white p-4 shadow-lg">
        <Info className="text-p-75" />
        <p className="flex-1">
          Please add an accreditation, license or justification for each state in which you provide
          in-person or remote services.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        {credentials.map(({ name, id, address }, index) => (
          <Details key={id} open className={index === 0 && 'border-t-0'}>
            <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
              <div className="flex w-full flex-col items-center justify-between md:flex-row">
                {address ? (
                  <InlineAddress {...address} className="flex h-10 items-center" />
                ) : (
                  <span>{name}</span>
                )}
                <Warning errors={errors} index={index} />
              </div>
            </Summary>
            <CredentialsFieldSet
              titleClass="text-xl font-bold"
              space="lg"
              name={`credentials.${index}`}
              control={control}
              withStateGrouping
            />
          </Details>
        ))}

        <SurveyStepControls />
      </form>
    </article>
  );
}

function Warning({ errors, index }) {
  return (
    !isEmpty(get(errors, `credentials[${[index]}]`)) && (
      <Alert
        className={`mt-4 max-w-md bg-warning-3 px-4 py-2 md:mt-0`}
        text={get(errors, `credentials[${[index]}].status.message`)}
        icon={<WarningIcon />}
      />
    )
  );
}

ProgramLicenseForm.propTypes = {
  program: PropTypes.object,
  onSubmit: PropTypes.func,
};

Warning.propTypes = {
  errors: PropTypes.object,
  index: PropTypes.number,
};
