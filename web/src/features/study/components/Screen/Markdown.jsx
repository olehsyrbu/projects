import { useMemo } from 'react';
import snarkdown from 'snarkdown';
import { sanitize } from 'dompurify';
import PropTypes from 'prop-types';

export function Markdown({ className, children }) {
  let html = useMemo(() => sanitize(snarkdown(children)), [children]);
  return <article className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

Markdown.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
};

Markdown.defaultProps = {
  className: 'prose',
};
