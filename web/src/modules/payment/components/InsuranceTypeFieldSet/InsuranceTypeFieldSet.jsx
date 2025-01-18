import { useController } from 'react-hook-form';
import { array } from 'yup';
import PropTypes from 'prop-types';
import { Suspense, useMemo } from 'react';
import { groupBy, isEmpty, union } from 'lodash-es';
import { useInsuranceTypes } from '@/core/api/ReferenceDataQueries';
import { Alert } from '@/core/components';
import { Warning16Regular as Warning } from '@fluentui/react-icons';
import { ReferenceDataSelect } from '@/modules/reference-data';
import { SelectSkeleton } from '@/modules/program/components/SelectSkeleton';

export function InsuranceTypeFieldSet({ name, control, states, refdataType }) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  const options = useInsuranceTypes(refdataType);

  const byStates = useMemo(
    () =>
      groupInsurancesByState({
        states,
        values: field.value,
        options,
      }),
    [states, field.value, options],
  );

  function remove(state) {
    return field.value.filter((id) => {
      let byCategory = groupBy(options, 'category');
      return !byCategory[state].some((item) => item.id === id);
    });
  }

  const withoutStates = useMemo(
    () =>
      getInsurancesWithoutState({
        values: field.value,
        options,
      }),
    [field.value, options],
  );

  return (
    <>
      {states.length ? (
        Object.entries(byStates).map(([state, insurances]) => {
          return (
            <div
              key={state}
              className="flex flex-col items-baseline gap-4 py-2 md:flex-row md:items-center"
            >
              <span className="font-bold md:basis-48">{state}:</span>
              <Suspense fallback={<SelectSkeleton className="w-full pl-48 md:basis-[26rem]" />}>
                <InsuranceRefDataSelect
                  category={state}
                  value={insurances}
                  className="w-full md:basis-[26rem]"
                  control={control}
                  isMulti
                  label="Insurance companies"
                  onChange={(data) => {
                    let value = remove(state);
                    if (!isEmpty(data)) {
                      value = union(
                        value,
                        data.map((d) => d.id),
                      );
                    }
                    field.onChange(value);
                  }}
                />
              </Suspense>
            </div>
          );
        })
      ) : (
        <ReferenceDataSelect
          control={control}
          isMulti
          label="Insurance companies"
          isCategorizeOptions
          value={withoutStates}
          options={options}
          onChange={(data) => {
            let value = data.map((d) => d.id);
            field.onChange(value);
          }}
        />
      )}
      {invalid && (
        <Alert
          className="mt-6 w-fit bg-warning-3 px-4 py-2"
          text={error.message}
          icon={<Warning />}
        />
      )}
    </>
  );
}

InsuranceTypeFieldSet.schema = () =>
  array().min(1, 'One insurance company is required per at least one state.');

InsuranceTypeFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  states: PropTypes.arrayOf(PropTypes.string),
  refdataType: PropTypes.string,
};

function groupInsurancesByState({ options, states, values } = {}) {
  const insurances = options.filter((o) => values.some((v) => v === o.id));
  const insurancesByCategory = groupBy(insurances, 'category');
  return states.reduce((memo, state) => {
    memo[state] = insurancesByCategory[state] || [];
    return memo;
  }, {});
}

function getInsurancesWithoutState({ options, values } = {}) {
  return values?.map((id) => options.find((item) => item.id === id));
}

function InsuranceRefDataSelect({ category, ...props }) {
  const insuranceOptions = useInsuranceTypes('PROGRAM');
  const options = useMemo(
    () => insuranceOptions.filter((opt) => opt.category === category),
    [category, insuranceOptions],
  );

  return <ReferenceDataSelect options={options} {...props} />;
}

InsuranceRefDataSelect.propTypes = {
  category: PropTypes.string,
};
