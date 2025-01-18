import { useState } from 'react';
import { Heart24Regular as Heart, Heart24Filled as HeartFilled } from '@fluentui/react-icons';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dialog, DialogTitle, DialogContent } from '@/core/components';
import { useMatchMedia } from '@/core/hooks';
import mixpanel from '@/core/mixpanel';
import { useReferralList, useShowReferralListView } from '@/modules/referral-list/hooks';
import { CheckList, ChipList } from '../../components';
import { BenefitsTrigger } from '../../components';
import { getEventProperties } from '../../getEventProperties';
import { SendEmailModal } from './SendEmailModal';
import { CallModal } from './CallModal';
import { useOrganization } from '@/modules/organization';

export function ContactPanel({ profile }) {
  let [modal, setModal] = useState(null);
  let closeModal = () => setModal(null);

  let smallScreen = useMatchMedia('(max-width: 768px)');
  let mediumScreen = useMatchMedia('(min-width: 768px) and (max-width: 1024px)');
  let largeScreen = useMatchMedia('(min-width: 1024px)');

  let showReferralList = useShowReferralListView() && profile.mode === 'PERSON';

  let { mode, paymentOptions, insuranceTypes } = profile;

  const organization = useOrganization();
  const isBcbsks = organization?.subdomain === 'bcbsks';

  insuranceTypes = insuranceTypes.map((type) => ({
    ...type,
    name: `${type.name}${type.category ? ` – ${type.category}` : ''}`,
  }));

  if (profile.freeInPersonConsultation) {
    paymentOptions = paymentOptions.concat({
      code: 'freeInPersonConsultation',
      name: 'I offer a free consultation',
    });
  }

  return (
    <>
      {smallScreen ? (
        <div
          className={cn(
            'sticky bottom-0 z-20 order-1 flex space-x-4 bg-white px-4 py-2.5 shadow-[0_-3px_10px_rgba(0,0,0,0.06)]',
            { 'bottom-[53px]': showReferralList },
          )}
        >
          <button className="mir-button primary flex-1" onClick={() => setModal('actions')}>
            Contact {mode === 'PROGRAM' ? 'program' : 'provider'}
          </button>

          {showReferralList ? <AddToReferralListButton profile={profile} /> : null}

          <Dialog isOpen={modal === 'actions'} onDismiss={closeModal}>
            <DialogTitle>Contact {mode === 'PROGRAM' ? 'program' : 'provider'}</DialogTitle>
            <DialogContent>
              <p className="mb-2.5">
                Contact {mode === 'PROGRAM' ? 'the program' : 'provider'} to schedule an intake
                appointment and follow their admission steps.
              </p>
              <ContactActions profile={profile} showRefListButton={false} onModalOpen={setModal} />
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      {mediumScreen ? (
        <div
          className={cn(
            'sticky bottom-0 z-20 order-1 mx-[calc((700px-100vw)/2)] bg-white px-4 py-2.5 shadow-[0_-3px_10px_rgba(0,0,0,0.06)]',
            { 'bottom-[53px]': showReferralList },
          )}
        >
          <ContactActions
            profile={profile}
            showRefListButton={showReferralList}
            onModalOpen={setModal}
          />
        </div>
      ) : null}

      {largeScreen ? (
        <div className="sticky top-6 order-1 col-[2/3] row-[1/10] mb-6 divide-y divide-graphics-30 self-start rounded-2xl border border-graphics-30 bg-white px-4 py-6 shadow-[0_4px_5px_rgba(1,26,32,0.1)]">
          <div className="pb-3">
            <ContactActions
              profile={profile}
              showRefListButton={showReferralList}
              onModalOpen={setModal}
            />
          </div>

          {paymentOptions?.length ? (
            <div className="py-3 text-sm">
              <CheckList items={paymentOptions} />
            </div>
          ) : null}

          {insuranceTypes?.length ? (
            <div className="py-3 pb-4">
              <h2 className="mb-3 text-base font-bold">Insurance</h2>
              <ChipList
                items={insuranceTypes}
                limit={isBcbsks ? 1 : 3}
                threshold={isBcbsks ? 1 : 6}
              />
            </div>
          ) : null}
          <div className="py-3">
            <BenefitsTrigger />
          </div>
        </div>
      ) : null}

      {modal === 'email' ? (
        <SendEmailModal
          profile={profile}
          onDismiss={closeModal}
          onBack={() => setModal('actions')}
        />
      ) : null}

      {modal === 'call' ? <CallModal profile={profile} onDismiss={closeModal} /> : null}
    </>
  );
}

function ContactActions({ profile, showRefListButton, onModalOpen }) {
  let { mode, onlineScheduler, preferredContacts: preferred } = profile;
  let showEmail = preferred.length === 0 || preferred.includes('EMAIL');
  let showPhone =
    preferred.length === 0 || preferred.includes('MOBILE') || preferred.includes('ADMISSION_PHONE');
  let showScheduler = preferred.length === 0 || preferred.includes('ONLINE_SCHEDULER');

  let eventProperties = getEventProperties(profile);

  function openEmail() {
    onModalOpen('email');
    mixpanel.track('Schedule an Appointment', { ...eventProperties, action: 'email' });
    mixpanel.track('Schedule Email Clicked', eventProperties);
  }

  function openCall() {
    onModalOpen('call');
    mixpanel.track('Schedule an Appointment', { ...eventProperties, action: 'phone' });
    mixpanel.track('Schedule Call', eventProperties);
  }

  function trackScheduleOpen() {
    mixpanel.track('Schedule an Appointment', { ...eventProperties, action: 'schedule' });
    mixpanel.track('Schedule Online', eventProperties);
  }

  return (
    <div className="mx-auto flex flex-col gap-4 md:max-w-[700px] md:max-lg:flex-row lg:gap-2">
      {showEmail ? (
        <button className="mir-button primary md:max-lg:flex-1" onClick={openEmail}>
          Send email
        </button>
      ) : null}
      {showPhone ? (
        <button className="mir-button primary md:max-lg:flex-1" onClick={openCall}>
          Call {mode === 'PROGRAM' ? 'program' : 'provider'}
        </button>
      ) : null}
      {onlineScheduler && showScheduler ? (
        <a
          className="mir-button primary md:max-lg:flex-1"
          href={onlineScheduler}
          target="_blank"
          rel="noreferrer"
          onClick={trackScheduleOpen}
        >
          Schedule online
        </a>
      ) : null}

      {showRefListButton ? <AddToReferralListButton profile={profile} /> : null}
    </div>
  );
}

function AddToReferralListButton({ profile }) {
  let referralList = useReferralList();
  let selected = referralList.providers.some((p) => p.id === profile.id);

  return (
    <button
      className="mir-button flex items-center p-2.5 max-lg:!border-0 max-lg:!p-2.5"
      onClick={() => referralList.addProvider(profile)}
    >
      {selected ? <HeartFilled className="text-[#c12300]" /> : <Heart className="text-p-100" />}
      <span className="ml-1 max-lg:hidden">Add to favorites</span>
    </button>
  );
}

ContactPanel.propTypes = {
  profile: PropTypes.object.isRequired,
};
ContactActions.propTypes = {
  profile: PropTypes.object.isRequired,
  showRefListButton: PropTypes.bool.isRequired,
  onModalOpen: PropTypes.func.isRequired,
};
AddToReferralListButton.propTypes = {
  profile: PropTypes.object.isRequired,
};
