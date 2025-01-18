import PropTypes from 'prop-types';
import cn from 'classnames';
import './Card.css';

function Card({ imageSrc, title, description, parentClass }) {
  return (
    <div className={cn('card', parentClass)}>
      <img src={imageSrc} alt="" />
      {title && <p className="card-title">{title}</p>}
      {description && <p className="card-description">{description}</p>}
    </div>
  );
}

Card.propTypes = {
  imageSrc: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  parentClass: PropTypes.string,
};

export default Card;
