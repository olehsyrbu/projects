import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@/modules/form';

export function SelectYear({ name, control, ...rest }) {
  let years = useMemo(getYears, []);
  return <Select options={years} control={control} name={name} {...rest} />;
}

function getYears() {
  let currentYear = new Date().getFullYear();
  let list = [];

  for (let year = currentYear; year >= 1960; year--) {
    list.push({ value: year.toString(), label: year.toString() });
  }

  return list;
}

SelectYear.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
