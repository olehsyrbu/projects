import PropTypes from 'prop-types';

export default function NoFilteredResources({ onClearFilters }) {
  return (
    <div className="no-resources">
      <h2 className="font-bold">Let's try again</h2>
      <p>
        Your search didn't return any results. Let's try again by changing filters or clearing them
        to see more options.
      </p>
      <button className="mir-button primary" onClick={onClearFilters}>
        Clear filters
      </button>
    </div>
  );
}

NoFilteredResources.propTypes = {
  onClearFilters: PropTypes.func.isRequired,
};
