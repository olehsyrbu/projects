import './Survey.css';
import PropTypes from 'prop-types';

export function SurveyStep({ element }) {
  return element;
}

SurveyStep.propTypes = {
  element: PropTypes.element.isRequired,
};
