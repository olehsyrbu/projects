import { ChipCheckbox } from '@/modules/form';
import PropTypes from 'prop-types';

export function PaymentMethodEdit({ name, control, items }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((method) => (
        <ChipCheckbox
          key={method.id}
          control={control}
          name={`${name}.${method.id}`}
          label={method.name}
        />
      ))}
    </div>
  );
}

PaymentMethodEdit.propTypes = {
  items: PropTypes.array,
  name: PropTypes.string,
  control: PropTypes.object,
};

PaymentMethodEdit.defaultProps = {
  items: [],
};

PaymentMethodEdit.toFormValue = (paymentMethods) => {
  return paymentMethods.map(({ id }) => id).reduce((acc, value) => ({ ...acc, [value]: true }), {});
};

PaymentMethodEdit.toValueApi = (paymentMethods) => ({
  paymentMethodIds: Object.keys(paymentMethods).filter((key) => paymentMethods[key] === true),
});
