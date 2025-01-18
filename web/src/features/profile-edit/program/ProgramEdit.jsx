import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Person24Filled as Person,
  PeopleCommunity24Filled as PeopleCommunity,
  Ribbon24Filled as Ribbon,
  Location24Filled as Location,
  Image24Filled as Image,
  Payment24Filled as Payment,
  CalendarLtr24Filled as CalendarLtr,
} from '@fluentui/react-icons';
import {
  ProgramAudience,
  ProgramGallery,
  ProgramGeneral,
  ProgramLocation,
  ProgramPayment,
  ProgramSchedule,
  ProgramServicesCredentials,
} from './';
import { EditorHeader } from '../EditorHeader';
import { TabLink, TabLinkItem, TabNav, TabNavPanel, TabRoute } from '../TabNav';
import { getProgramCompletion } from '@/modules/program/utils';
import { useProgram } from '@/core/api/ProgramQueries';

export function ProgramEdit({ id }) {
  const program = useProgram(id);
  const { general, audience, services, location, gallery, payment, schedule } =
    getProgramCompletion(program);
  const navigate = useNavigate();

  function handleBack() {
    navigate('/program/resources');
  }

  const isRemote = program.remote?.available;

  return (
    <div className="mx-auto max-w-5xl">
      <EditorHeader text="Edit program" onBack={handleBack} />
      <TabNav className="md:min-h-[45rem]">
        <TabNavPanel heading="Edit program">
          <div>
            <TabLink to="general">
              <TabLinkItem percent={general} title="General" icon={Person} />
            </TabLink>
            <TabLink to="audience">
              <TabLinkItem percent={audience} title="Audience" icon={PeopleCommunity} />
            </TabLink>
            <TabLink to="services">
              <TabLinkItem percent={services} title="Services and Credentials" icon={Ribbon} />
            </TabLink>
            <TabLink to="location">
              <TabLinkItem percent={location} title="Location" icon={Location} />
            </TabLink>
            {!isRemote && (
              <TabLink to="gallery">
                <TabLinkItem percent={gallery} title="Gallery" icon={Image} />
              </TabLink>
            )}
            <TabLink to="payment">
              <TabLinkItem percent={payment} title="Payment" icon={Payment} />
            </TabLink>
            <TabLink to="schedule">
              <TabLinkItem percent={schedule} title="Schedule" icon={CalendarLtr} />
            </TabLink>
          </div>
        </TabNavPanel>
        <TabRoute path="general" heading="General">
          <Suspense fallback="ProgramGeneral loading...">
            <ProgramGeneral program={program} />
          </Suspense>
        </TabRoute>
        <TabRoute path="audience" heading="Audience">
          <Suspense fallback="AudienceForm loading...">
            <ProgramAudience program={program} />
          </Suspense>
        </TabRoute>
        <TabRoute path="services" heading="Services and Credentials">
          <Suspense fallback="Services And Credentials loading...">
            <ProgramServicesCredentials program={program} />
          </Suspense>
        </TabRoute>
        <TabRoute path="location" heading="Location">
          <Suspense fallback="Location loading...">
            <ProgramLocation program={program} />
          </Suspense>
        </TabRoute>
        {!isRemote && (
          <TabRoute path="gallery" heading="Gallery">
            <Suspense fallback="Gallery loading...">
              <ProgramGallery program={program} />
            </Suspense>
          </TabRoute>
        )}
        <TabRoute path="payment" heading="Payment">
          <Suspense fallback="Payment loading...">
            <ProgramPayment program={program} />
          </Suspense>
        </TabRoute>
        <TabRoute path="schedule" heading="Schedule">
          <Suspense fallback="Schedule loading...">
            <ProgramSchedule program={program} />
          </Suspense>
        </TabRoute>
      </TabNav>
    </div>
  );
}

ProgramEdit.propTypes = {
  id: PropTypes.string.isRequired,
};
