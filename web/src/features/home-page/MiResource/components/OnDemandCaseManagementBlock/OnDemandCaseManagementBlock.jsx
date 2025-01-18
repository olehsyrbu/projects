import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import config from '@/core/config';
import './OnDemandCaseManagementBlock.css';

export function OnDemandCaseManagementBlock({ onMatchMe }) {
  return (
    <div className="management-block">
      <div>
        <p>Answer a few questions and we will guide you in your search.</p>
        <Link className="mir-button light" to="/guided-search">
          Get matched
        </Link>
      </div>

      <div>
        <p>Our expert care navigators are here to connect you with care.</p>
        <span className="relative inline-block">
          <a
            className="mir-button light"
            href={config.onDemandCaseManagementUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => onMatchMe('button')}
          >
            Match me
            <span className="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform rounded-lg bg-favorites px-2 py-1 text-xs leading-none text-white">
              NEW
            </span>
          </a>
        </span>
      </div>
    </div>
  );
}

OnDemandCaseManagementBlock.propTypes = {
  onMatchMe: PropTypes.func,
};
