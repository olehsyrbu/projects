import { useOrganization } from '@/modules/organization';
import { useReferenceData } from '@/modules/reference-data';
import { getStates } from './getStates';

export function useDefaultPayments(profile) {
  let organization = useOrganization();
  let paymentOptionsData = useReferenceData('PaymentOption', { types: [profile.mode] });
  let states = getStates(profile);

  let insurance = paymentOptionsData.find(({ code }) => code === 'insurance');

  let { paymentOptions, insuranceTypes } = profile;
  let isPreselectedInsurance = false;

  if (paymentOptions.length === 0 && organization?.insuranceTypes.length > 0) {
    paymentOptions = [insurance];
    insuranceTypes = organization.insuranceTypes;
    isPreselectedInsurance = true;
  }

  if (states.length > 0) {
    insuranceTypes = insuranceTypes.filter((type) => states.includes(type.category));
  }

  return {
    states,
    isPreselectedInsurance,
    methods: paymentOptions.map((option) => option.id),
    insurances: insuranceTypes.map((type) => type.id),
    insuranceId: insurance.id,
    refdataType: profile.mode,
  };
}
