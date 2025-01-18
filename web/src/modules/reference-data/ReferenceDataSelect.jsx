import PropTypes from 'prop-types';
import { Select } from '@/core/components/Select';

export function ReferenceDataSelect(props) {
  function mapToValueAndLabel(data, isCategorizeOptions, sorted) {
    if (data?.length > 0) {
      return data
        .map(({ id, name, value, category, code, description }) => ({
          value: id || value,
          label: name,
          group: isCategorizeOptions && category,
          code,
          description,
        }))
        .sort((a, b) => (sorted ? a?.label.localeCompare(b?.label) : 0))
        .sort((a, b) => a.group?.localeCompare(b?.group));
    }
    return data;
  }

  const options = mapToValueAndLabel(props.options, props.isCategorizeOptions, props.sorted);
  const value = mapToValueAndLabel(props.value, props.isCategorizeOptions);

  if (props.isMulti) {
    return <MultiReferenceDataSelect {...props} options={options} value={value} />;
  }
  return <SingleReferenceDataSelect {...props} options={options} />;
}

function MultiReferenceDataSelect({ value, onChange, isCategorizeOptions, sorted, ...props }) {
  function handlerChange(data) {
    onChange(
      data?.map(({ value, label, group, code, description }) => ({
        id: value,
        name: label,
        category: group,
        code,
        description,
      })),
    );
  }

  return <Select value={value} onChange={handlerChange} {...props} />;
}

MultiReferenceDataSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        category: PropTypes.string,
        code: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    PropTypes.string,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  isCategorizeOptions: PropTypes.bool,
  sorted: PropTypes.bool,
};

function SingleReferenceDataSelect({ options, onChange, ...props }) {
  let value = getValue(props.value);

  function getValue(value) {
    if (typeof value === 'string') {
      return options.find(({ name }) => name === value);
    }

    if (value?.id && value?.name) {
      value = { value: value.id, label: value.name, ...value };
    }
    return value;
  }

  function handlerChange(data) {
    if (data?.value && data?.label) {
      onChange({
        id: data.value,
        name: data.label,
        category: data.group,
        code: data.code,
        description: data.description,
      });
    }
  }

  return <Select {...props} value={value} options={options} onChange={handlerChange} />;
}

SingleReferenceDataSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

ReferenceDataSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        category: PropTypes.string,
        code: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    PropTypes.string,
    PropTypes.object,
  ]),
  label: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  infoMessage: PropTypes.string,
  isCategorizeOptions: PropTypes.bool,
  isCategoryInChip: PropTypes.bool,
  isMulti: PropTypes.bool,
  invalid: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorMessage: PropTypes.string,
  sorted: PropTypes.bool,
};

ReferenceDataSelect.defaultProps = {
  options: [],
  sorted: true,
};
