import PropTypes from 'prop-types';

export function InlineAddress({ address1, address2, city, state, zip, zipCode, className }) {
  return (
    <div className={className}>
      {[address1, address2, city, state?.code, zip, zipCode].filter(Boolean).join(', ')}
    </div>
  );
}

InlineAddress.propTypes = {
  className: PropTypes.string,
  address1: PropTypes.string,
  address2: PropTypes.string,
  city: PropTypes.string,
  zip: PropTypes.string,
  state: PropTypes.object,
};
