import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { object, string } from 'yup';
import { TextArea } from '@/modules/form';
import { Radio } from '@/core/components/Radio';
import { useNoLicenseReasons } from '@/core/api/ReferenceDataQueries';

export function OtherLicenseReasons({ name, control, mode }) {
  let reasons = useNoLicenseReasons(mode);
  const {
    field: { value, onChange },
  } = useController({ name, control });
  const { code } = value?.noLicenseReason || {};

  return (
    <div className="flex flex-col gap-y-4">
      {reasons.map((reason) => (
        <Radio
          key={reason.id}
          value={reason.id}
          checked={code === reason.code}
          onClick={() => {
            onChange({
              noLicenseReason: { id: reason.id, code: reason.code },
              state: value.state,
            });
          }}
        >
          {reason.name}
        </Radio>
      ))}
      {'ORNL' === code && (
        <div className="ml-8">
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

OtherLicenseReasons.propTypes = {
  name: PropTypes.string,
  mode: PropTypes.string.isRequired,
  control: PropTypes.object,
};

OtherLicenseReasons.schema = object({
  comment: string().when('noLicenseReason', {
    is: (reason) => reason?.code === 'ORNL',
    then: string().required('This field is required'),
  }),
});
