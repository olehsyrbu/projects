import PropTypes from 'prop-types';

export function Waves({ width, firstColor, secondColor, ...rest }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 1440 67" {...rest}>
      <path
        d="M923 2.48603C1013.5 2.48603 1251 -10.314 1440 22.175V64.486H0V22.175C75.5591 2.48054 169.767 2.48389 228.699 2.48598L230.5 2.48602C289.3 2.48602 409.5 22.175 548 22.175C686.5 22.175 832.5 2.48603 923 2.48603Z"
        fill={firstColor}
      />
      <path
        d="M324 21.1428C233.5 21.1428 189 18.1428 0 39.6429V67.6429H1440V39.6429C1363.67 26.4762 1253.3 21.1428 1194.5 21.1428C1135.7 21.1428 931.5 39.6429 793 39.6429C654.5 39.6429 414.5 21.1428 324 21.1428Z"
        fill={secondColor}
      />
    </svg>
  );
}

Waves.propTypes = {
  width: PropTypes.number,
  firstColor: PropTypes.string,
  secondColor: PropTypes.string,
};

Waves.defaultProps = {
  width: 1440,
  firstColor: 'var(--p-75)',
  secondColor: 'var(--p-120)',
};
