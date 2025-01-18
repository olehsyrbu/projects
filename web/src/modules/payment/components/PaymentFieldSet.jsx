import { useMemo } from 'react';
import { useController, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { array, object } from 'yup';
import { PaymentTypeFieldSet } from './PaymentTypeFieldSet';
import { InsuranceTypeFieldSet } from './InsuranceTypeFieldSet';
import { Alert } from '@/core/components';
import { Warning16Regular as WarningIcon } from '@fluentui/react-icons';

export function PaymentFieldSet({ control, name, titleInsurance }) {
  const path = (child) => (name ? `${name}.${child}` : child);

  const {
    fieldState: { error },
  } = useController({ control, name: 'methods' });

  const states = useWatch({
    name: path('states'),
    control,
  });

  const selectedMethods = useWatch({
    name: path('methods'),
    control,
  });

  const insuranceId = useWatch({
    name: path('insuranceId'),
    control,
  });

  const refdataType = useWatch({
    name: path('refdataType'),
    control,
  });

  const isInsurance = useMemo(
    () => selectedMethods.find((item) => item === insuranceId),
    [selectedMethods, insuranceId],
  );

  return (
    <>
      {error?.message && (
        <Alert
          className="mb-4 w-fit bg-warning-3 px-4 py-2 md:mb-6"
          text={error?.message}
          icon={<WarningIcon />}
        />
      )}
      <PaymentTypeFieldSet name={path('methods')} control={control} refdataType={refdataType} />
      {isInsurance && (
        <fieldset>
          <legend className="py-4 text-base font-bold">{titleInsurance}</legend>
          <InsuranceTypeFieldSet
            name={path('insurances')}
            states={states}
            control={control}
            refdataType={refdataType}
          />
        </fieldset>
      )}
    </>
  );
}

PaymentFieldSet.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  titleInsurance: PropTypes.string,
};

PaymentFieldSet.schema = () =>
  object({
    methods: PaymentTypeFieldSet.schema(),
    insurances: array().when(['methods', 'insuranceId'], {
      is: (methods, insuranceId) => methods?.find((item) => item === insuranceId),
      then: InsuranceTypeFieldSet.schema(),
    }),
  });

PaymentFieldSet.toValueApi = ({ methods, insurances, insuranceId }) => {
  let patch = {};
  const isInsurance = methods?.find((item) => item === insuranceId);
  if (methods) {
    patch.paymentOptionIds = methods;
  }
  if (insurances && isInsurance) {
    patch.insuranceTypeIds = insurances;
  } else {
    patch.insuranceTypeIds = [];
  }

  return patch;
};
