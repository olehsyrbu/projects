import { Map24Regular as Map } from '@fluentui/react-icons';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { useSearchResults } from '@/features/advanced-search/hooks';

export function MapButton({ handleClick, query, text }) {
  const searchResults = useSearchResults(query, false);
  const { pageInfo } = searchResults || {};

  function onClick() {
    handleClick();
  }

  if (pageInfo?.totalPages?.length === 0) {
    return null;
  }

  return (
    <div className="map-btn-sticky">
      <button className="mir-button primary" onClick={onClick} type="button">
        <Map />
        <span className="text">{text}</span>
      </button>
    </div>
  );
}

MapButton.propTypes = {
  handleClick: PropTypes.func,
  query: PropTypes.object,
  text: PropTypes.string,
};

MapButton.defaultProps = {
  handleClick: noop,
  text: 'Show Map',
};
