import PropTypes from 'prop-types';
import { Markdown } from './Markdown';

export function ScreenQuestion({ question }) {
  return <Markdown className="text-lg leading-7">{question}</Markdown>;
}

ScreenQuestion.propTypes = {
  question: PropTypes.string,
};
