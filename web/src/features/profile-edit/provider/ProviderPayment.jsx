import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { usePaymentMethods } from '@/core/api/ReferenceDataQueries';

import { useAuthContext } from '@/modules/auth';
import { PaymentFieldSet, useDefaultPayments } from '@/modules/payment';
import { Switch, TextField } from '@/modules/form';
import { DurationFieldSet } from '@/modules/program';

import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';
import { PaymentMethodEdit } from '../PaymentMethodEdit';

const schema = object().shape({
  payments: PaymentFieldSet.schema(),
  onlinePaymentUrl: string().url('Please enter a valid URL').optional().nullable(),
  cost: object().shape({
    start: number()
      .test(
        'start',
        'Your minimum session cost must be less than your maximum session cost',
        (start, { parent }) => start <= parent.end,
      )
      .integer(),
    end: number().integer(),
  }),
});

export function ProviderPayment({ provider }) {
  const update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  const paymentMethodsRefData = usePaymentMethods(provider.method);

  function getCostValue({ sessionCostLow, sessionCostHigh, sessionCostTime }) {
    return {
      start: !!sessionCostLow ? sessionCostLow : 0,
      end: !!sessionCostHigh ? sessionCostHigh : 0,
      timeframe: sessionCostTime || null,
    };
  }

  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      cost: getCostValue(provider),
      payments: useDefaultPayments(provider),
      paymentMethods: PaymentMethodEdit.toFormValue(provider.paymentMethods),
      onlinePaymentUrl: provider.onlinePaymentUrl,
      freeInPersonConsultation: provider.freeInPersonConsultation,
    },
    resolver: yupResolver(schema),
  });

  const paymentMethods = watch('paymentMethods');
  const onlineItem = paymentMethodsRefData.find(({ code }) => code === 'online');

  async function submit(values) {
    if (isDirty) {
      const { cost, payments, paymentMethods, onlinePaymentUrl, freeInPersonConsultation } = values;

      const { sessionCostLow, sessionCostHigh } = DurationFieldSet.toValueApi(cost);
      const newProfile = {
        ...PaymentFieldSet.toValueApi(payments),
        ...PaymentMethodEdit.toValueApi(paymentMethods),
        sessionCostLow,
        sessionCostHigh,
        freeInPersonConsultation,
        onlinePaymentUrl:
          paymentMethods[onlineItem.id] && onlinePaymentUrl ? onlinePaymentUrl : null,
      };

      await update(provider.id, newProfile, user);
      reset(values);
    }
  }

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div>
          <p className="pb-4 text-base font-bold">Payment options accepted</p>
          <PaymentFieldSet
            name="payments"
            control={control}
            titleInsurance="In-network insurance"
          />
        </div>
        <div>
          <p className="py-4 text-base font-bold">
            Methods of payment <span className="font-normal">(optional)</span>
          </p>
          <PaymentMethodEdit
            name="paymentMethods"
            control={control}
            items={paymentMethodsRefData}
          />
          {paymentMethods[onlineItem.id] ? (
            <TextField
              inputClassName="mt-4 w-full md:max-w-[412px]"
              label="Type in URL (optional)"
              name="onlinePaymentUrl"
              control={control}
            />
          ) : null}
        </div>
        <div>
          <p className="py-4 text-base font-bold">
            Session cost <span className="font-normal">(optional)</span>
          </p>
          <DurationFieldSet prefixValues="$" name="cost" control={control} hideTimeframe />
          <Switch className="mt-6" name="freeInPersonConsultation" control={control}>
            I offer a free consultation.
          </Switch>
        </div>
      </form>
      <EditorActions
        isDisabled={!isDirty}
        isLoading={isSubmitting}
        onSave={handleSubmit(submit)}
        onCancel={() => reset()}
      />
    </>
  );
}

ProviderPayment.propTypes = {
  provider: PropTypes.object,
};
