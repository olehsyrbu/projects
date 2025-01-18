import PropTypes from 'prop-types';

export function ProviderServiceLocation({ provider, className }) {
  let serviceLocation = null;
  const remote = provider?.remote?.available;
  const inPerson = provider?.inPerson?.available;

  if (remote) {
    serviceLocation = inPerson ? 'Remote or in-person' : 'Remote only';
  } else if (inPerson) {
    serviceLocation = 'In-person only';
  }

  return serviceLocation && <span className={className}>{serviceLocation}</span>;
}

ProviderServiceLocation.propTypes = {
  provider: PropTypes.object,
  className: PropTypes.string,
};
