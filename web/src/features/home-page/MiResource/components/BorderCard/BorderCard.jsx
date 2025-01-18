import PropTypes from 'prop-types';
import './BorderCard.css';

function BorderCard({ imageSrc, comingSoon, imageBackground, title, description }) {
  return (
    <div className="BorderCard">
      <div style={{ backgroundColor: imageBackground }} className="image-background">
        <img src={imageSrc} alt="" />
        {comingSoon && <div className="comingSoon">Coming SOON</div>}
      </div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

BorderCard.propTypes = {
  imageSrc: PropTypes.string,
  comingSoon: PropTypes.bool,
  imageBackground: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default BorderCard;
