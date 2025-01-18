import { Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  CalendarLtr24Filled as CalendarLtr,
  ClipboardTextLtr24Filled as ClipboardTextLtr,
  Location24Filled as Location,
  Payment24Filled as Payment,
  Person24Filled as Person,
  Ribbon24Filled as Ribbon,
} from '@fluentui/react-icons';
import { Meter } from '@/core/components/Meter';
import { getProfileCompletion } from '@/modules/provider/utils';
import { usePersonProvider } from '@/modules/provider/hooks';

import { TabLink, TabLinkItem, TabNav, TabNavPanel, TabRoute } from '../TabNav';
import {
  EditorHeader,
  ProfileUpdated,
  ProviderCredentials,
  ProviderGeneral,
  ProviderLocation,
  ProviderPayment,
  ProviderSchedule,
  ProviderSpecialty,
} from './';

export function ProviderEdit({ id, onBack }) {
  const heading = 'Edit profile';
  const provider = usePersonProvider(id);
  const { general, specialty, credentials, payment, location, schedule, totalCompletion } =
    getProfileCompletion(provider);

  //TODO: MIR-5309 New layout for all pages
  return (
    <div className="mx-auto">
      <EditorHeader text={heading} onBack={onBack} />
      <TabNav className="md:min-h-[45rem]">
        <TabNavPanel heading={heading}>
          <div>
            <TabLink to="general">
              <TabLinkItem percent={general} title="General" icon={Person} />
            </TabLink>
            <TabLink to="speciality">
              <TabLinkItem percent={specialty} title="Speciality" icon={ClipboardTextLtr} />
            </TabLink>
            <TabLink to="credentials">
              <TabLinkItem percent={credentials} title="Credentials" icon={Ribbon} />
            </TabLink>
            <TabLink to="location">
              <TabLinkItem percent={location} title="Location" icon={Location} />
            </TabLink>
            <TabLink to="payment">
              <TabLinkItem percent={payment} title="Payment" icon={Payment} />
            </TabLink>
            <TabLink to="schedule">
              <TabLinkItem percent={schedule} title="Schedule" icon={CalendarLtr} />
            </TabLink>

            <div className="mt-6 space-y-2.5 px-5 py-3 text-sm">
              Profile completion: <span className="font-medium">{totalCompletion}%</span>
              <Meter value={totalCompletion} aria-label="Profile completion" />
            </div>

            <ProfileUpdated provider={provider} />
          </div>
        </TabNavPanel>
        <TabRoute path="general" heading="General">
          <Suspense fallback="General loading...">
            <ProviderGeneral provider={provider} />
          </Suspense>
        </TabRoute>
        <TabRoute path="speciality" heading="Speciality">
          <Suspense fallback="speciality loading...">
            <ProviderSpecialty provider={provider} />
          </Suspense>
        </TabRoute>
        <TabRoute path="credentials" heading="Credentials">
          <Suspense fallback="Credentials loading...">
            <ProviderCredentials provider={provider} />
          </Suspense>
        </TabRoute>
        <TabRoute path="location" heading="Location">
          <Suspense fallback="Location loading...">
            <ProviderLocation provider={provider} />
          </Suspense>
        </TabRoute>
        <TabRoute path="payment" heading="Payment">
          <Suspense fallback="Payment loading...">
            <ProviderPayment provider={provider} />
          </Suspense>
        </TabRoute>
        <TabRoute path="schedule" heading="Schedule">
          <Suspense fallback="Schedule loading...">
            <ProviderSchedule provider={provider} />
          </Suspense>
        </TabRoute>
      </TabNav>
    </div>
  );
}

ProviderEdit.propTypes = {
  id: PropTypes.string,
  onBack: PropTypes.func,
};

ProviderEdit.defaultProps = {
  id: undefined,
  onBack: () => {},
};
