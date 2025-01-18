import { useController } from 'react-hook-form';
import { useReferenceData } from '@/modules/reference-data';
import { ReferenceDataSelect } from '@/modules/reference-data';
import PropTypes from 'prop-types';
import { NumberInput } from './NumberInput';
import { number, object } from 'yup';

export function DurationFieldSet({
  name,
  control,
  prefixValues,
  prefixMeasure,
  refDataCategory,
  hideTimeframe,
}) {
  let { field, fieldState } = useController({
    name,
    control,
    defaultValue: { start: 0, end: 0, timeframe: null },
  });

  const errorMessage = fieldState.error?.timeframe?.message || fieldState.error?.start?.message;

  return (
    <div className="space-y-2">
      <div className="-m-2 flex flex-wrap">
        <div className="m-2 flex items-center">
          {prefixValues && <span className="mr-2">{prefixValues}</span>}
          <NumberInput
            min="0"
            className="w-20"
            inputClassName="!text-left py-3 px-2 pl-3"
            onChange={(value) => field.onChange({ ...field.value, start: value })}
            value={field.value.start}
            invalid={fieldState.error?.start}
          />
          <span className="mx-4">to</span>
          {prefixValues && <span className="mr-2">{prefixValues}</span>}
          <NumberInput
            min="1"
            className="mr-4 w-20"
            inputClassName="!text-left py-3 px-2 pl-3"
            onChange={(value) => field.onChange({ ...field.value, end: value })}
            id="end"
            value={field.value.end}
            invalid={fieldState.error?.end}
          />
          {prefixMeasure && <span>{prefixMeasure}</span>}
        </div>
        {hideTimeframe ? null : (
          <TimeframeSelect
            category={refDataCategory}
            hideError
            className="m-2 flex-1 basis-[180px] sm:grow-0"
            label="Select timeframe"
            value={field.value.timeframe}
            invalid={fieldState.error?.timeframe}
            onChange={(data) => field.onChange({ ...field.value, timeframe: data })}
          />
        )}
      </div>
      <ErrorMessage message={errorMessage} />
    </div>
  );
}

DurationFieldSet.defaultProps = {
  refDataCategory: null,
};

DurationFieldSet.propTypes = {
  refDataCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  control: PropTypes.object,
  hideTimeframe: PropTypes.bool,
  name: PropTypes.string,
  prefixValues: PropTypes.string,
  prefixMeasure: PropTypes.string,
};

DurationFieldSet.schema = (children) =>
  object().shape({
    start: number()
      .min(0)
      .test(
        'start',
        'The minimum value must be less than the maximum value',
        (start, { parent }) => start <= parent.end,
      )
      .required('Please type a minimum value')
      .integer()
      .nullable(),
    end: number().min(0).required('These field is required').integer().nullable(),
    timeframe: object().required('These fields are required').nullable(),
    ...children,
  });

DurationFieldSet.toValueApi = ({ start, end, timeframe }) => {
  if (start === 0 && end === 0)
    return { sessionCostLow: 0, sessionCostHigh: 0, sessionCostTime: null };
  return {
    sessionCostLow: start ? start : 0,
    sessionCostHigh: end ? end : 0,
    sessionCostTime: timeframe?.code,
  };
};

function ErrorMessage({ message }) {
  return <>{message ? <div className="font-base text-xs text-error-1">{message}</div> : null}</>;
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

function TimeframeSelect(props) {
  let types = useReferenceData('DurationTimeframe', { types: ['PROGRAM'] }).filter(
    ({ category }) => category === props.category,
  );
  return <ReferenceDataSelect {...props} options={types} isSearchable={false} sorted={false} />;
}
