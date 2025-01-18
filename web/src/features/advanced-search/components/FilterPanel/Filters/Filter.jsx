import PropType from 'prop-types';

export function Filter(props) {
  const { component, ...other } = props;
  return <component {...other} />;
}

Filter.propTypes = {
  id: PropType.string.isRequired,
  label: PropType.string.isRequired,
  component: PropType.func.isRequired,
};
