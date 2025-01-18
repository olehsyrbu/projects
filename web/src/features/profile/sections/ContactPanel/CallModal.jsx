import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { Dialog, DialogTitle, DialogContent } from '@/core/components';
import { formatPhoneNumber } from '@/core/utils';
import { getEventProperties } from '../../getEventProperties';

export function CallModal({ profile, onDismiss }) {
  let { mode, legalFirstName, mobile, admissionPhone, preferredContacts } = profile;
  let isProgram = mode === 'PROGRAM';
  let showAdmissionPhone = admissionPhone && preferredContacts.includes('ADMISSION_PHONE');
  let showMobile = mobile && preferredContacts.includes('MOBILE');

  function trackPhoneClick(type) {
    mixpanel.track('Phone Call', {
      ...getEventProperties(profile),
      phoneType: type,
    });
  }

  function handleAdmissionPhone() {
    trackPhoneClick('admission');
  }

  function handleGeneralPhone() {
    trackPhoneClick('general');
  }
  return (
    <Dialog isOpen onDismiss={onDismiss}>
      <DialogTitle>Call {isProgram ? 'for admission' : 'provider'}</DialogTitle>
      <DialogContent>
        <p className="mb-4">
          You can reach out to {isProgram ? 'the program' : legalFirstName} with this phone number
          {admissionPhone ? '(s)' : null}
        </p>

        <div className="max-md:space-y-3 md:flex">
          {showAdmissionPhone ? (
            <div className="max-md:border-b max-md:border-graphics-30 max-md:py-2 md:flex-1">
              <p className="mb-1 font-bold">Admission phone</p>
              {admissionPhone && (
                <a
                  href={`tel:${admissionPhone}`}
                  onClick={handleAdmissionPhone}
                  className="text-xl text-p-100"
                >
                  {formatPhoneNumber(admissionPhone)}
                </a>
              )}
            </div>
          ) : null}

          {showMobile ? (
            <div className="max-md:border-b max-md:border-graphics-30 max-md:py-2 md:flex-1">
              {showAdmissionPhone ? <p className="mb-1 font-bold">General phone</p> : null}
              {mobile && (
                <a
                  href={`tel:${mobile}`}
                  onClick={handleGeneralPhone}
                  className="text-xl text-p-100"
                >
                  {formatPhoneNumber(mobile)}
                </a>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

CallModal.propTypes = {
  profile: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
