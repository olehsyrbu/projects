import { Suspense } from 'react';
import { useWatch } from 'react-hook-form';
import { Checkbox } from '@/modules/form';

import {
  AccreditationFieldSet,
  LicenseFieldSet,
  OtherLicenseReasons,
} from '@/modules/program/components';
import { array, object, string } from 'yup';
import PropTypes from 'prop-types';
import { isEmpty, isString } from 'lodash-es';
import format from 'date-fns/formatISO';

export function CredentialsFieldSet({ name, control, titleClass, withStateGrouping }) {
  let isAccreditationChecked = useWatch({
    name: `${name}.isAccreditationChecked`,
    control,
  });
  let isLicenseChecked = useWatch({
    name: `${name}.isLicenseChecked`,
    control,
  });
  const shouldShowReasons = !isLicenseChecked && !isAccreditationChecked;

  return (
    <div className="gap-y-4 divide-x-0 divide-y divide-solid divide-graphics-30">
      <div className="space-y-4 pb-6">
        <Checkbox
          className="items-center [&>svg]:mt-0"
          name={`${name}.isAccreditationChecked`}
          control={control}
        >
          <span className={titleClass}>Accreditation</span>
        </Checkbox>
        {isAccreditationChecked && (
          <AccreditationFieldSet name={`${name}.accreditations`} control={control} />
        )}
      </div>
      <div className="space-y-6 pt-6">
        <Checkbox
          className="items-center [&>svg]:mt-0"
          name={`${name}.isLicenseChecked`}
          control={control}
        >
          <span className={titleClass}>License</span>
        </Checkbox>
        {isLicenseChecked ? (
          <Suspense fallback="Loading license...">
            <LicenseFieldSet
              name={`${name}.licenses`}
              control={control}
              isStateDisabled={withStateGrouping}
            />
          </Suspense>
        ) : (
          <div />
        )}
      </div>
      {shouldShowReasons && (
        <div className="pt-6">
          <legend className="!mb-6 font-bold">This program isn’t accredited or licensed</legend>
          <OtherLicenseReasons mode="PROGRAM" name={`${name}.noLicense`} control={control} />
        </div>
      )}
    </div>
  );
}

CredentialsFieldSet.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  titleClass: PropTypes.string,
  withStateGrouping: PropTypes.bool,
};

CredentialsFieldSet.defaultProps = {
  titleClass: '',
};

CredentialsFieldSet.schema = () =>
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
      .when('isAccreditationChecked', {
        is: true,
        then: string().test(
          'accreditations-validation',
          'Some information is missing. Please make sure all fields are filled in.',
          (value, context) =>
            AccreditationFieldSet.schema().isValidSync(context.parent.accreditations),
        ),
      })
      .when(['isLicenseChecked', 'isAccreditationChecked', 'noLicense'], {
        is: (isLicenseChecked, isAccreditationChecked, noLicense) =>
          !isLicenseChecked && !isAccreditationChecked && noLicense?.noLicenseReason?.id === '',
        then: string().required(
          'Please select at least one accreditation/license type or a reason you don’t have one',
        ),
      }),
    licenses: array().when('isLicenseChecked', {
      is: true,
      then: LicenseFieldSet.schema(),
    }),
    accreditations: array().when('isAccreditationChecked', {
      is: true,
      then: AccreditationFieldSet.schema(),
    }),
    noLicense: object().when(['isLicenseChecked', 'isAccreditationChecked'], {
      is: (isLicenseChecked, isAccreditationChecked) =>
        !isLicenseChecked && !isAccreditationChecked,
      then: OtherLicenseReasons.schema,
    }),
  });

CredentialsFieldSet.toFormValue = ({ state, program }) => {
  const { accreditations, licenses, noLicense } = program;

  const accreditationsByState = state
    ? accreditations.filter((item) => item.state?.id === state.id)
    : accreditations;
  const hasAccreditations = accreditationsByState.length > 0;

  const licensesByState = state
    ? licenses.filter((item) => item.state?.id === state?.id)
    : licenses;
  const hasLicences = licensesByState?.length > 0;

  const noLicenseByState = state
    ? noLicense.filter((item) => item.state?.id === state?.id)
    : noLicense;
  const hasNoLicense = noLicenseByState?.length > 0;

  return {
    isAccreditationChecked: hasAccreditations,
    isLicenseChecked: hasLicences,
    accreditations: hasAccreditations
      ? accreditationsByState
      : [{ body: '', accreditedAt: '', expiredAt: '', state }],
    licenses: hasLicences
      ? licensesByState
      : [
          {
            organization: '',
            name: '',
            number: '',
            state,
            expiredAt: '',
          },
        ],
    noLicense: hasNoLicense
      ? noLicenseByState[0]
      : { comment: '', noLicenseReason: { id: '', code: '' }, state },
  };
};

CredentialsFieldSet.toValueApi = (credentials) => {
  let patch = { noLicense: [], licenses: [], accreditations: [] };

  credentials.forEach(
    ({ licenses, noLicense, isLicenseChecked, isAccreditationChecked, accreditations }) => {
      if (isLicenseChecked) {
        const licensesByState = licenses
          .filter((l) => l.name && l.number)
          .map(({ state, expiredAt, type, id, isSupervisorLicense, ...rest }) => ({
            ...rest,
            expiredAt: isString(expiredAt) ? expiredAt : format(expiredAt, 'MM/dd/yyyy'),
            stateId: state?.id,
          }));
        patch.licenses = [...patch.licenses, ...licensesByState];
      }
      if (isAccreditationChecked) {
        const accreditationsByState = accreditations.map(
          ({ body, accreditedAt, expiredAt, state }) => ({
            body,
            accreditedAt,
            expiredAt,
            stateId: state?.id,
          }),
        );

        patch.accreditations = [...patch.accreditations, ...accreditationsByState];
      }
      if (!isLicenseChecked && !isAccreditationChecked && !isEmpty(noLicense.noLicenseReason)) {
        const noLicenseByState = {
          id: noLicense.noLicenseReason.id,
          comment: noLicense.comment || '',
          stateId: noLicense.state?.id,
        };
        patch.noLicense = [...patch.noLicense, noLicenseByState];
      }
    },
  );

  return patch;
};
