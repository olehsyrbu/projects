import PropTypes from 'prop-types';
import { useReferenceData } from '@/modules/reference-data';
import { ReferenceDataSelect } from '@/modules/form';

export function RefDataSelect({ type, excluded, mode, sort, ...rest }) {
  const excludedIds = new Set(excluded?.map((i) => i.id));
  const options = useReferenceData(type, { types: [mode] }, sort);
  const filtered = options.filter((option) => !excludedIds.has(option.id));

  return (
    <ReferenceDataSelect
      className="max-w-md"
      label="Select all that apply"
      isSearchable={false}
      isMulti
      {...rest}
      options={filtered}
    />
  );
}

RefDataSelect.propTypes = {
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  excluded: PropTypes.array,
  sort: PropTypes.object,
};

RefDataSelect.defaultProps = {};
