import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import noResultImage from '../../../../images/NoResult-image.png';

export function NoResults({ onResetFilters }) {
  return (
    <section className="no-results">
      <img src={noResultImage} alt="" />
      <h2>Let's try again</h2>
      <p>
        Sorry, your search didn’t return any results.
        <br />
        Try removing filters or changing location to see more options.
      </p>
      <div className="actions !mb-8">
        <button className="mir-button primary" onClick={onResetFilters}>
          Clear All Filters
        </button>
        <Link className="mir-button" to="/guided-search">
          Get matched
        </Link>
      </div>
    </section>
  );
}

NoResults.propTypes = {
  onResetFilters: PropTypes.func.isRequired,
  guidedSearchUrl: PropTypes.string,
};
