import { useController, useWatch } from 'react-hook-form';
import { TextArea } from '@/modules/form';
import { object, string } from 'yup';
import PropTypes from 'prop-types';
import { useNoLicenseReasons } from '@/core/api/ReferenceDataQueries';
import { Switch } from '@/core/components/Switch';

export function OtherReasons({ name, control }) {
  let reasons = useNoLicenseReasons('PROGRAM');

  let code = useWatch({
    name: `${name}.noLicenseReason.code`,
    control,
  });

  const { field } = useController({
    name,
    control,
  });

  return (
    <div className="flex flex-col gap-y-4">
      {reasons.map((reason) => (
        <Switch
          key={reason.id}
          id={reason.id}
          name={reason.id}
          defaultSelected={field.value?.noLicenseReason?.id === reason.id}
          onClick={() => field.onChange({ ...field.value, noLicenseReason: reason })}
        >
          {reason.name}
        </Switch>
      ))}
      {'ORNL' === code && (
        <div className="my-4">
          <p className="mb-2 font-bold">Please elaborate below</p>
          <TextArea
            name={`${name}.comment`}
            control={control}
            minRows={3}
            maxRows={5}
            maxLength={154}
          />
        </div>
      )}
    </div>
  );
}

OtherReasons.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
};

OtherReasons.schema = object({
  comment: string().when('noLicenseReason', {
    is: (reason) => reason?.code === 'ORNL',
    then: string().required('This field is required'),
  }),
});
