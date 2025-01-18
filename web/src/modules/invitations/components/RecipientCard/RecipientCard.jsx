import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { noop } from '@/core/utils';
import './RecipientCard.css';

export function RecipientCard({
  name,
  email,
  badge,
  actions,
  highlighted,
  selected,
  hover,
  onClick,
  role,
}) {
  let [shouldHighlight, setShouldHighlight] = useState(highlighted);

  useEffect(() => {
    if (selected) {
      setShouldHighlight(false);
    }
  }, [selected]);

  return (
    <div
      role={role}
      className={cn('mir-recipient-card', { selected, highlighted: shouldHighlight, hover })}
      onAnimationEnd={() => setShouldHighlight(false)}
      onClick={onClick}
      data-testid={email}
    >
      <h3 className="font-bold">{name}</h3>
      <span>{email}</span>
      <div className="badge">{badge}</div>
      <div className="actions">{actions}</div>
    </div>
  );
}

RecipientCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  badge: PropTypes.node,
  actions: PropTypes.node,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  role: PropTypes.string,
};

RecipientCard.defaultProps = {
  selected: false,
  highlighted: false,
  hover: false,
  onClick: noop,
  role: 'listitem',
};
