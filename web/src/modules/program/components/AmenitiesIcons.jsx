import PropTypes from 'prop-types';

export function AmenitiesIcons({ category, ...rest }) {
  switch (category) {
    case 'Cell phone use':
      return <CellPhone {...rest} />;
    case 'Laptop / Tablet use':
      return <Laptop {...rest} />;
    case 'Smoking':
      return <Smoking {...rest} />;
    case 'Vaping':
      return <Vaping {...rest} />;
    case 'Exercise':
      return <Exercise {...rest} />;
    default:
      return null;
  }
}

AmenitiesIcons.propTypes = {
  category: PropTypes.string,
};

export function getSpecialAmenities() {
  return [
    { category: 'Cell phone use', prohibitCode: 'ACPUSP', permittedCode: 'ACPUP' },
    {
      category: 'Laptop / Tablet use',
      prohibitCode: 'ALTUSP',
      permittedCode: 'ALTUP',
    },
    { category: 'Smoking', prohibitCode: 'ASNP', permittedCode: 'ASP' },
    { category: 'Vaping', prohibitCode: 'AVNP', permittedCode: 'AVP' },
    { category: 'Exercise', prohibitCode: 'AENP', permittedCode: 'AEP' },
  ];
}

function CellPhone({ size = 16, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M10.5 1.333a1.5 1.5 0 0 1 1.5 1.5v10.333a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5V2.833a1.5 1.5 0 0 1 1.5-1.5h5Zm0 1h-5a.5.5 0 0 0-.5.5v10.333a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V2.833a.5.5 0 0 0-.5-.5Zm-1.667 9.333a.5.5 0 0 1 .001 1l-1.667.003a.5.5 0 1 1-.001-1l1.667-.003Z" />
    </svg>
  );
}

function Laptop({ size = 16, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...rest}
    >
      <path d="M1.833 11h12.334a.5.5 0 0 1 .067.995l-.067.005H1.834a.5.5 0 0 1-.068-.996L1.834 11h12.332H1.834Zm10.334-7.667c.644 0 1.166.523 1.166 1.167v5a1.167 1.167 0 0 1-1.166 1.166H3.833A1.167 1.167 0 0 1 2.667 9.5v-5c0-.644.522-1.167 1.166-1.167h8.334Zm0 1H3.833a.167.167 0 0 0-.166.167v5c0 .092.074.166.166.166h8.334a.167.167 0 0 0 .166-.166v-5a.167.167 0 0 0-.166-.167Z" />
    </svg>
  );
}

function Exercise({ size = 16, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...rest}
    >
      <path d="M11.844 5.187a.5.5 0 0 1-.706.707L10.09 4.847a.5.5 0 0 1 .707-.707l1.046 1.047Zm-5.581 6.288a.5.5 0 0 0 0-.707L5.216 9.722a.5.5 0 1 0-.706.706l1.046 1.047a.5.5 0 0 0 .707 0Zm7.695-9.434a1.295 1.295 0 0 0-1.83 0l-.447.447-.138-.138a1.61 1.61 0 0 0-2.441.194A1.957 1.957 0 0 0 7.36 5.853l.478.479-1.493 1.492-.478-.478a1.957 1.957 0 0 0-3.309 1.742 1.609 1.609 0 0 0-.194 2.44l.138.139-.461.461a1.294 1.294 0 0 0 1.83 1.83l.462-.461.138.138a1.61 1.61 0 0 0 2.44-.194 1.958 1.958 0 0 0 1.743-3.308l-.478-.479 1.493-1.493.477.479a1.957 1.957 0 0 0 3.309-1.742 1.607 1.607 0 0 0 .194-2.441l-.138-.138.447-.447a1.295 1.295 0 0 0 0-1.831Zm-1.154 1.57-.416-.415.447-.447a.294.294 0 0 1 .417.415l-.448.448ZM8.962 7.455 7.468 8.948l-.416-.417 1.494-1.493.415.416ZM3.626 12.79l-.462.462a.293.293 0 0 1-.48-.096.294.294 0 0 1 .064-.32l.462-.462.416.415Zm6.349-9.732a.609.609 0 0 1 .86 0l2.107 2.107a.608.608 0 0 1-.241 1.009.5.5 0 0 0-.3.683.958.958 0 0 1-1.547 1.076L8.067 5.146A.957.957 0 0 1 9.143 3.6a.5.5 0 0 0 .683-.3c.03-.091.081-.173.149-.24ZM3.806 8.053a.958.958 0 0 1 1.354 0l2.786 2.786a.958.958 0 0 1-1.075 1.548.5.5 0 0 0-.684.3.609.609 0 0 1-1.01.241l-2.106-2.107a.608.608 0 0 1 .241-1.009.5.5 0 0 0 .3-.683.958.958 0 0 1 .194-1.076Z" />
    </svg>
  );
}

function Smoking({ size = 16, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.856 3a.5.5 0 1 0-1 0c0 1.092.22 1.83.706 2.373.424.475 1.016.75 1.598 1.02l.129.06c.66.308 1.194.607 1.516.983.153.178.25.367.293.581.042.215.033.486-.075.835a.5.5 0 0 0 .955.296c.147-.477.18-.917.1-1.323a2.248 2.248 0 0 0-.513-1.04c-.478-.557-1.199-.933-1.853-1.238l-.04-.019c-.67-.312-1.082-.504-1.364-.82-.258-.29-.452-.745-.452-1.708Zm4.584 7.921H6.986V12.5h6.454v-1.578Zm-10.88 0h3.426V12.5H2.56v-1.578Zm0 2.578H13.44a1 1 0 0 0 1-1v-1.578a1 1 0 0 0-1-1H2.56a1 1 0 0 0-1 1V12.5a1 1 0 0 0 1 1Z"
      />
    </svg>
  );
}

function Vaping({ size = 16, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.926.488h2.136V2.87h-.002c.258.27.416.634.416 1.037v1.748a1 1 0 0 1 .827.985v7.872a1 1 0 0 1-1 1H5.697a1 1 0 0 1-1-1V6.64a1 1 0 0 1 1-1h1.125V3.907a1.5 1.5 0 0 1 1.104-1.448V.488Zm1.136 1v.921a1.527 1.527 0 0 0-.086-.002h-.05v-.92h.136Zm.414 4.152V3.907a.5.5 0 0 0-.5-.5h-.654a.5.5 0 0 0-.5.5V5.64h1.654Zm-3.779 1h4.606v7.872H5.697V6.64Zm1.48 2.515v1.208a.172.172 0 0 1-.343 0V9.155a.172.172 0 1 1 .343 0Zm-1.343 0a1.172 1.172 0 1 1 2.343 0v1.208a1.172 1.172 0 0 1-2.343 0V9.155Z"
      />
    </svg>
  );
}
