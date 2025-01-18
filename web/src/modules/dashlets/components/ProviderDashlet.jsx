import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { Meter, MeterCircle } from '@/core/components/Meter';
import DashboardGeneralIcon from '@/images/Shared/DashboardGeneralIcon.svg';
import DashboardSpecialtyIcon from '@/images/Shared/DashboardSpecialtyIcon.svg';
import DashboardCredentialsIcon from '@/images/Shared/DashboardCredentialsIcon.svg';
import DashboardLocationIcon from '@/images/Shared/DashboardLocationIcon.svg';
import DashboardPaymentIcon from '@/images/Shared/DashboardPaymentIcon.svg';
import DashboardScheduleIcon from '@/images/Shared/DashboardScheduleIcon.svg';
import { ResourceTips } from '@/modules/dashlets/components';
import { getLastUpdatedAt, getProfileCompletion } from '@/modules/provider/utils';

import { useAvailabilityTypes } from '@/core/api/ReferenceDataQueries';
import { ReferenceDataSelect } from '@/modules/reference-data';
import { useAvailabilityByStatus } from '@/modules/reference-data';
import format from 'date-fns/format';
import { Checkmark20Filled as Checkmark } from '@fluentui/react-icons';
import { logger } from '@/core/logger';

export function ProviderDashlet({ gpaResourceType, onEditProvider, provider, onSave }) {
  const { general, specialty, location, credentials, payment, schedule, totalCompletion } =
    getProfileCompletion(provider);
  const [availabilityTypesRefData] = useAvailabilityTypes();

  const [availabilityByStatus, setAvailabilityByStatus] = useState(
    useAvailabilityByStatus(provider?.availability?.status),
  );

  const updatedAt = useMemo(() => {
    const lastUpdatedAt = new Date(getLastUpdatedAt(provider.updatedAt, provider.availability));
    const updatedAtString = format(lastUpdatedAt, 'MMM d, yyyy');
    const isUpdateToday = updatedAtString === format(new Date(), 'MMM d, yyyy');
    return isUpdateToday ? 'Today' : updatedAtString;
  }, [provider]);

  const [availabilityUpdate, setAvailabilityUpdate] = useState(null);

  const handleChangeAvailability = async (value) => {
    if (value.code || value.id) {
      try {
        setAvailabilityByStatus(value);
        await onSave({
          availability: {
            status: value.code || value.id,
          },
        });
        setAvailabilityUpdate('Updated');
        setTimeout(() => {
          setAvailabilityUpdate('Today');
        }, 5000);
      } catch (e) {
        logger.error(e);
      }
    }
  };

  return (
    <div className="provider-profile-completion fade-in p-6 pt-0">
      <div className="mb-1 mt-3 flex flex-col items-center justify-between lg:flex-row ">
        <div className="w-full lg:w-60">
          <ReferenceDataSelect
            label="Availability"
            options={availabilityTypesRefData}
            value={availabilityByStatus}
            onChange={handleChangeAvailability}
          />
        </div>

        <button
          onClick={onEditProvider}
          className="mir-button primary !mt-3 h-12 w-full md:!mt-0 lg:my-0 lg:w-auto"
        >
          Edit Profile
        </button>
      </div>
      {availabilityUpdate === 'Updated' ? (
        <p className="mb-6 flex items-center text-sm text-variant-100">
          <Checkmark />
          <span className="ml-1">Updated</span>
        </p>
      ) : (
        <p className="mb-6 text-sm text-hint">Last updated: {availabilityUpdate || updatedAt}</p>
      )}

      <div className="mb-1 space-y-2.5 py-3">
        Profile Completion: <span className="font-bold">{totalCompletion}%</span>
        <Meter value={totalCompletion} aria-label="Profile Completion" />
      </div>

      <div className="profile-completion-summary">
        <ul>
          <li>
            <div className="label">
              <img src={DashboardGeneralIcon} alt="" />
              <span>General</span>
            </div>

            <MeterCircle value={general} id="generalProgress" />
          </li>

          <li>
            <div className="label">
              <img src={DashboardSpecialtyIcon} alt="" />
              <span>Specialty</span>
            </div>

            <MeterCircle value={specialty} id="specialtyProgress" />
          </li>

          <li>
            <div className="label">
              <img src={DashboardCredentialsIcon} alt="" />
              <span>Credentials</span>
            </div>

            <MeterCircle value={credentials} id="credentialsProgress" />
          </li>

          <li>
            <div className="label">
              <img src={DashboardLocationIcon} alt="" />
              <span>Location</span>
            </div>

            <MeterCircle value={location} id="locationProgress" />
          </li>

          <li>
            <div className="label">
              <img src={DashboardPaymentIcon} alt="" />
              <span>Payment</span>
            </div>
            <MeterCircle value={payment} id="paymentProgress" />
          </li>

          <li>
            <div className="label">
              <img src={DashboardScheduleIcon} alt="" />
              <span>Schedule</span>
            </div>
            <MeterCircle value={schedule} id="scheduleProgress" />
          </li>
        </ul>
      </div>

      <div className="resource-tip">
        <h3 className="font-bold">Resource Tip</h3>
        <ResourceTips gpaResourceType={gpaResourceType} />
      </div>
    </div>
  );
}

ProviderDashlet.propTypes = {
  onSave: PropTypes.func,
  onEditProvider: PropTypes.func,
  gpaResourceType: PropTypes.string,
  provider: PropTypes.object,
};
