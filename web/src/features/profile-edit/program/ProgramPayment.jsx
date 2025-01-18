import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentFieldSet, useDefaultPayments } from '@/modules/payment';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { logger } from '@/core/logger';
import { usePaymentMethods } from '@/core/api/ReferenceDataQueries';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { TextField } from '@/modules/form';
import { DurationFieldSet } from '@/modules/program';
import { PaymentMethodEdit } from '../PaymentMethodEdit';

const schema = object().shape({
  payments: PaymentFieldSet.schema(),
  onlinePaymentUrl: string().url('Please enter a valid URL').optional().nullable(),
  cost: object().shape({
    start: number()
      .test(
        'start',
        'Your minimum program cost must be less than your maximum program cost',
        (start, { parent }) => start <= parent.end,
      )
      .integer(),
    end: number().integer(),
    timeframe: object()
      .test(
        'timeframe',
        'Timeframe is required',
        (timeframe, { parent }) => !(parent.end && timeframe === null),
      )
      .nullable(),
  }),
});

export function ProgramPayment({ program }) {
  let update = useUpdateProgram();
  const paymentMethodsRefData = usePaymentMethods('PROGRAM');

  function getCostValue(program) {
    return {
      start: !!program.sessionCostLow ? program.sessionCostLow : 0,
      end: !!program.sessionCostHigh ? program.sessionCostHigh : 0,
      timeframe: program.sessionCostTime || null,
    };
  }

  let {
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      cost: getCostValue(program),
      payments: useDefaultPayments(program),
      paymentMethods: PaymentMethodEdit.toFormValue(program.paymentMethods),
      onlinePaymentUrl: program.onlinePaymentUrl,
    },
    resolver: yupResolver(schema),
  });

  const paymentMethods = watch('paymentMethods');
  const onlineItem = paymentMethodsRefData.find(({ code }) => code === 'online');

  async function submit({ payments, onlinePaymentUrl, paymentMethods, cost }) {
    try {
      if (isDirty) {
        const newProgram = await update(program.id, {
          ...PaymentFieldSet.toValueApi(payments),
          ...PaymentMethodEdit.toValueApi(paymentMethods),
          ...DurationFieldSet.toValueApi(cost),
          onlinePaymentUrl:
            paymentMethods[onlineItem.id] && onlinePaymentUrl ? onlinePaymentUrl : null,
        });
        reset({ ...getValues(), cost: getCostValue(newProgram) });
      }
    } catch (error) {
      logger.error(error);
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
            titleInsurance="List insurance companies the program is in-network with."
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
            Program cost <span className="font-normal">(optional)</span>
          </p>
          <DurationFieldSet
            refDataCategory="Program Cost"
            prefixValues="$"
            prefixMeasure="per"
            name="cost"
            control={control}
          />
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

ProgramPayment.propTypes = {
  program: PropTypes.object,
};
