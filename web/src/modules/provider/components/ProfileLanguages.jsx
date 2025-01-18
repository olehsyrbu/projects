import PropTypes from 'prop-types';

export function ProfileLanguages({ languageServices }) {
  const hasManyLangs = languageServices.length > 2;
  const languages = hasManyLangs ? languageServices.slice(0, 2) : languageServices;

  return (
    <span className="mir-badge-label-text-dash">
      <span className="mir-list-commas">
        Speaks
        {languages.map(({ name }) => (
          <span key={name}>{`${name}`}</span>
        ))}
      </span>
      {hasManyLangs && <span>+{languageServices?.slice(2)?.length}</span>}
    </span>
  );
}

ProfileLanguages.propTypes = {
  languageServices: PropTypes.array,
};
