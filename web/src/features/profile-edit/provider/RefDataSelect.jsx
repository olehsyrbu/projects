import PropTypes from 'prop-types';
import { useReferenceData } from '@/modules/reference-data';
import { ReferenceDataSelect } from '@/modules/form';

export function RefDataSelect({ type, label, ...rest }) {
  const options = useReferenceData(type, { types: ['PERSON'] });
  return (
    <ReferenceDataSelect
      className="max-w-md"
      label={label}
      isSearchable={false}
      {...rest}
      options={options}
    />
  );
}

RefDataSelect.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
};

RefDataSelect.defaultProps = {
  isMulti: true,
  label: 'Select all that apply',
};
