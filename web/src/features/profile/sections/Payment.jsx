/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import { Payment20Regular as PaymentIcon } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import { ChipList, CheckList } from '../components/List';
import { useOrganization } from '@/modules/organization';
import { BenefitsTrigger } from '../components';

export function Payment({ profile, anchorId }) {
  let organization = useOrganization();
  let isMediumScreen = useScreen('md');
  let isBcbsks = organization?.subdomain === 'bcbsks';
  let {
    sessionCostLow: from,
    sessionCostHigh: to,
    sessionCostTime: timeframe,
    paymentOptions,
  } = profile;

  if (profile.freeInPersonConsultation) {
    paymentOptions = paymentOptions.concat({
      code: 'freeInPersonConsultation',
      name: 'I offer a free consultation',
    });
  }

  return (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold text-regular" id={anchorId}>
        Payment options
      </h2>

      {from || to ? (
        <p className="flex items-center gap-x-2">
          {!from && to ? 'Up to' : null}
          <span className="text-xl font-bold">
            {from && to ? `$${from} — $${to}` : `$${from || to}`}
          </span>
          per {timeframe?.name.toLowerCase() ?? 'session'}
        </p>
      ) : null}

      {profile.insuranceTypes?.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xl font-bold">Insurance</h3>
          <p className="mb-3">In-network coverage provided for the following insurance companies</p>
          <ChipList
            items={profile.insuranceTypes.map((type) => ({
              ...type,
              name: `${type.name} – ${type.category}`,
            }))}
            limit={isBcbsks ? 1 : 3}
            threshold={isBcbsks ? 1 : 6}
          />
        </div>
      ) : null}

      {paymentOptions?.length > 0 ? (
        <CheckList items={paymentOptions} threshold={false} aria-label="Payment options" />
      ) : null}

      {!isMediumScreen ? <BenefitsTrigger /> : null}

      {profile.paymentMethods?.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-xl font-bold">Payment methods</h3>
          <ChipList
            items={
              profile.onlinePaymentUrl
                ? profile.paymentMethods.filter((method) => method.code !== 'online')
                : profile.paymentMethods
            }
            threshold={false}
          />
          {profile.onlinePaymentUrl ? (
            <a
              href={profile.onlinePaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-sm font-medium text-p-100"
            >
              <PaymentIcon className="mr-1" />
              Pay online
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

Payment.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
