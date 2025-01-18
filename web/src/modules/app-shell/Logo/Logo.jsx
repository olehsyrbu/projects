import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOrganization } from '@/modules/organization';
import MiLogo from './MiLogo';

function Logo({ isNormalSize }) {
  let navigate = useNavigate();
  let organization = useOrganization();

  let handleRedirectToHome = () => navigate('/');

  return (
    <div className="flex w-full flex-col items-center justify-center md:box-border md:h-fit md:items-start">
      {organization ? (
        <div className="flex cursor-pointer items-center" onClick={handleRedirectToHome}>
          <div
            className={`flex h-12 w-[7.5rem] justify-end ${isNormalSize ? 'md:w-[11.5rem]' : ''}`}
          >
            <img
              className="h-full object-contain"
              src={organization.attributes.logoUrl}
              alt={organization.name}
            />
          </div>
          <div className="ml-3 border-l pl-3 text-regular">
            <div className="text-xs font-light">powered by </div>
            <MiLogo height={16} width={79} />
          </div>
        </div>
      ) : (
        <span className="cursor-pointer" onClick={handleRedirectToHome}>
          <MiLogo className="text-[#1fa3aa]" />
        </span>
      )}
    </div>
  );
}

Logo.propTypes = {
  isNormalSize: PropTypes.bool,
};

Logo.defaultProps = {
  isNormalSize: true,
};

export default Logo;
