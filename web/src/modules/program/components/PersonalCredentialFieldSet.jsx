import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { useWatch } from 'react-hook-form';
import { array, object, string } from 'yup';
import { first, isEmpty, uniqBy } from 'lodash-es';

import { TooltipPsypact } from '@/modules/provider';
import { Checkbox, Switch, Warning } from '@/modules/form';
import { LicenseFieldSet, OtherLicenseReasons } from './LicenseFieldSet';
import { PsyPactFieldSet } from './PsyPactFieldSet';

export function PersonalCredentialFieldSet({ name, control, withStateGrouping }) {
  let isLicenseChecked = useWatch({
    name: `${name}.isLicenseChecked`,
    control,
  });
  let isUnderSupervision = useWatch({
    name: `${name}.isUnderSupervision`,
    control,
  });

  let isPsyPact = useWatch({
    name: `${name}.isPsyPact`,
    control,
  });

  return (
    <>
      <Warning message={`${name}.status.message`} className="mt-4 px-4 py-2" control={control} />
      <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
        <div className="space-y-4 py-6">
          <Checkbox
            className="items-center [&>svg]:mt-0"
            name={`${name}.isLicenseChecked`}
            control={control}
          >
            <span>License</span>
          </Checkbox>
          {isLicenseChecked && (
            <Suspense fallback="Loading license...">
              <LicenseFieldSet
                name={`${name}.licenses`}
                control={control}
                isStateDisabled={withStateGrouping}
              />
            </Suspense>
          )}
        </div>
        {isLicenseChecked && (
          <div className="space-y-6 py-6">
            <div className="flex items-center space-x-2">
              <Switch className="!inline-flex" name={`${name}.isPsyPact`} control={control}>
                PsyPact License
              </Switch>
              <TooltipPsypact />
            </div>
            {isPsyPact && <PsyPactFieldSet name={`${name}.PsyPact`} control={control} />}
          </div>
        )}
        <div className="space-y-4 py-6">
          <Checkbox
            className="items-center [&>svg]:mt-0"
            name={`${name}.isUnderSupervision`}
            control={control}
          >
            <span>I am under supervision, so I will list my supervisor’s license information</span>
          </Checkbox>
          {isUnderSupervision && (
            <Suspense fallback="Loading license...">
              <LicenseFieldSet
                hideAddMoreLicense
                name={`${name}.supervisorLicense`}
                control={control}
                isStateDisabled={withStateGrouping}
              />
            </Suspense>
          )}
        </div>
        {!isLicenseChecked && !isUnderSupervision && (
          <div className="pt-6">
            <legend className="!mb-6 font-bold">I don’t have a license</legend>
            <OtherLicenseReasons mode="PERSON" name={`${name}.noLicense`} control={control} />
          </div>
        )}
      </div>
    </>
  );
}

PersonalCredentialFieldSet.schema = () =>
  object({
    status: string()
      .when('isLicenseChecked', {
        is: true,
        then: string().test(
          'license-validation',
          'Some information is missing. Please make sure all fields are filled in.',
          (value, context) => LicenseFieldSet.schema().isValidSync(context.parent.licenses),
        ),
      })
      .when('isUnderSupervision', {
        is: true,
        then: string().test(
          'supervisor-license-validation',
          'Some information is missing. Please make sure all fields are filled in.',
          (value, context) =>
            LicenseFieldSet.schema().isValidSync(context.parent.supervisorLicense),
        ),
      })
      .when(['isLicenseChecked', 'isUnderSupervision', 'noLicense'], {
        is: (isLicenseChecked, isUnderSupervision, noLicense) =>
          !isLicenseChecked && !isUnderSupervision && noLicense?.noLicenseReason?.id === '',
        then: string().required(
          'Please select at least one accreditation/license type or a reason you don’t have one',
        ),
      }),
    licenses: array().when('isLicenseChecked', {
      is: true,
      then: LicenseFieldSet.schema(),
    }),
    supervisorLicense: array().when('isUnderSupervision', {
      is: true,
      then: LicenseFieldSet.schema(),
    }),
    noLicense: object().when(['isLicenseChecked', 'isUnderSupervision'], {
      is: (isLicenseChecked, isUnderSupervision) => !isLicenseChecked && !isUnderSupervision,
      then: OtherLicenseReasons.schema,
    }),
    PsyPact: object().when('isPsyPact', {
      is: true,
      then: PsyPactFieldSet.schema,
    }),
  });

PersonalCredentialFieldSet.toFormValue = ({ state, provider }) => {
  const { locations } = provider;
  const emptyLicense = {
    isSupervisorLicense: false,
    organization: '',
    name: '',
    number: '',
    expiredAt: '',
  };

  const uniqueStates = uniqBy(
    locations.map((location) => location.address.state),
    'id',
  );

  const defaultLicenses = uniqueStates.length
    ? uniqueStates.map((state) => {
        return {
          ...emptyLicense,
          state,
        };
      })
    : [emptyLicense];

  const defaultNoLicense = { comment: '', noLicenseReason: { id: '', code: '' }, state };
  let { licenses, noLicense } = provider;
  const { isPsyPact, PsyPact } = PsyPactFieldSet.toFormValue(licenses);

  const supLicenses = licenses.filter(({ isSupervisorLicense }) => isSupervisorLicense);
  licenses = licenses.filter(
    ({ isSupervisorLicense, type }) => !isSupervisorLicense && type !== 'PSYPACT',
  );

  function filterLicense(licenses) {
    return state ? licenses.filter((license) => license.state?.id === state?.id) : licenses;
  }

  const licensesByState = filterLicense(licenses);

  const supervisorLicense = isEmpty(supLicenses)
    ? [{ ...first(defaultLicenses), isSupervisorLicense: true }]
    : supLicenses;

  return {
    isLicenseChecked: !isEmpty(licensesByState),
    licenses: isEmpty(licensesByState) ? defaultLicenses : licensesByState,
    noLicense: isEmpty(noLicense)
      ? defaultNoLicense
      : {
          ...first(noLicense),
          comment: first(noLicense).comment || '',
        },
    isUnderSupervision: !isEmpty(supLicenses),
    supervisorLicense,
    isPsyPact,
    PsyPact,
  };
};

PersonalCredentialFieldSet.toValueApi = ({
  licenses,
  noLicense,
  isLicenseChecked,
  isUnderSupervision,
  supervisorLicense,
  isPsyPact,
  PsyPact,
}) => {
  if (!isLicenseChecked && !isUnderSupervision && !isEmpty(noLicense.noLicenseReason)) {
    return {
      noLicense: [
        {
          noLicenseReasonId: noLicense.noLicenseReason.id,
          comment: noLicense.comment,
        },
      ],
      licenses: [],
    };
  } else {
    if (isUnderSupervision) {
      licenses.push({
        ...first(supervisorLicense),
        isSupervisorLicense: true,
      });
    }

    if (isPsyPact) {
      licenses.push({
        name: '',
        number: PsyPact.number,
        expiredAt: PsyPact.expiredAt,
        type: 'PSYPACT',
      });
    }

    return {
      licenses: LicenseFieldSet.toValueApi(licenses),
      noLicense: [],
    };
  }
};

PersonalCredentialFieldSet.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  withStateGrouping: PropTypes.bool,
};
