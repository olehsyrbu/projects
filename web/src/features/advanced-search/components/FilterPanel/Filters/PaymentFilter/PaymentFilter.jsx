import PropTypes from 'prop-types';
import { useOrganization } from '@/modules/organization';
import { ReferenceDataSelectController } from '../FilterControllers';
import { PaymentMethodFilter } from './PaymentMethodsFilter';

export function PaymentFilter({ control, query, dataKey, onAfterChange }) {
  let organization = useOrganization();
  let { paymentMethods, modes } = query;

  function handleAfterChange({ next, name, prev }) {
    onAfterChange({ dataKey, name, prev, next });
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-2 rounded-lg bg-p-10 p-4">
        <p className="font-bold">Understand your payment options</p>
        <p>To learn more about how insurance works, contact your insurance provider.</p>
      </div>

      {organization?.subdomain !== 'bcbsks' ? (
        <div className="space-y-3">
          <ReferenceDataSelectController
            name="networkInsurance"
            type="InsuranceType"
            label="In-network insurance"
            defaultValue={query.networkInsurance}
            onAfterChange={handleAfterChange}
            modes={modes}
            isCategorizeOptions
            isCategoryInChip
            id="networkInsuranceFilter"
          />
          <p className="text-sm">
            Select the insurance you have, if you are currently residing out-of-state please select
            out-of-network and contact your insurance company to check if you are covered.
          </p>
        </div>
      ) : (
        <p className="text-sm">
          If you are currently residing out-of-state please select out-of-network and contact your
          insurance company to check if you are covered.
        </p>
      )}

      <PaymentMethodFilter
        name="paymentMethods"
        modes={modes}
        methods={paymentMethods}
        onAfterChange={handleAfterChange}
        control={control}
      />
    </div>
  );
}

PaymentFilter.propTypes = {
  name: PropTypes.string,
  dataKey: PropTypes.string,
  onAfterChange: PropTypes.func,
  control: PropTypes.object.isRequired,
  query: PropTypes.shape({
    modes: PropTypes.array,
    networkInsurance: PropTypes.array,
    paymentMethods: PropTypes.array,
  }),
};

PaymentFilter.defaultProps = {
  query: {
    networkInsurance: [],
    paymentMethods: [],
  },
};
