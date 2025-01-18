import { array } from 'yup';
import PropTypes from 'prop-types';
import { usePaymentOptions } from '@/core/api/ReferenceDataQueries';
import { TooltipIcon } from '@/core/components/Tooltip';
import { Checkbox } from '@/modules/form';

export function PaymentTypeFieldSet({ name, control, refdataType }) {
  const referencePaymentOptions = usePaymentOptions(refdataType);

  return (
    <div className="grid gap-4 gap-x-14 gap-y-3 md:grid-cols-2">
      {referencePaymentOptions.map(({ id, code, name: label }) => (
        <Checkbox key={id} name={name} value={id} control={control} className="flex items-center">
          <span className="text-sm">{label}</span>
          {code === 'docforpatient' && (
            <TooltipIcon
              label="You provide paperwork for the client/patient to file with their own insurance company."
              classNameIcon="ml-2"
            />
          )}
          {code === 'outofnetwork' && (
            <TooltipIcon
              label="Select if you help patients file claims with insurance companies you are out-of-network with."
              classNameIcon="ml-2"
            />
          )}
        </Checkbox>
      ))}
    </div>
  );
}

PaymentTypeFieldSet.schema = () => array().min(1, 'Please select at least one payment');

PaymentTypeFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  children: PropTypes.node,
  refdataType: PropTypes.string,
};
