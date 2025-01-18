import { useController, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { array, object, string } from 'yup';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import { Checkbox, TextField } from '@/modules/form';
import { Warning16Regular as Warning } from '@fluentui/react-icons';
import { Alert } from '@/core/components';

let fieldsProgram = [
  { label: 'Email', name: 'email', slug: 'EMAIL', type: 'email' },
  { label: 'General office phone', name: 'mobile', slug: 'MOBILE', type: 'tel' },
  { label: 'Admissions phone', name: 'admissionPhone', slug: 'ADMISSION_PHONE', type: 'tel' },
  {
    label: 'Online scheduler (optional)',
    name: 'onlineScheduler',
    slug: 'ONLINE_SCHEDULER',
    type: 'url',
  },
];

let fieldsProvider = [
  { label: 'Email', name: 'email', slug: 'EMAIL', type: 'email' },
  { label: 'Phone', name: 'mobile', slug: 'MOBILE', type: 'tel' },
  {
    label: 'Online scheduler (optional)',
    name: 'onlineScheduler',
    slug: 'ONLINE_SCHEDULER',
    type: 'url',
  },
];

let validatePhone = (value) => isMobilePhone(value, 'en-US');

export function ContactFieldSet({ type, name: rootName, control }) {
  const fields = type === 'PERSON' ? fieldsProvider : fieldsProgram;
  let n = (name) => (rootName ? `${rootName}.${name}` : name);
  let { fieldState } = useController({ name: n('preferredContacts'), control });
  let inputFields = useWatch({
    name: rootName,
    control,
  });

  const handleInputChange = (e) => {
    e.target.value = e.target.value.replace(/[^0-9-()+\s]/g, '');
  };

  return (
    <div className="space-y-4 [&_.error-message]:!mb-0">
      {fieldState.error && (
        <Alert
          className="mb-4 bg-warning-3 px-4 py-2"
          text={fieldState.error.message}
          icon={<Warning />}
        />
      )}
      {fields.map(({ label, name: fieldName, type, slug }) => (
        <div key={slug} className="grid-cols-[412px_max-content] gap-x-8 md:grid">
          <TextField
            label={label}
            name={n(fieldName)}
            type={type}
            control={control}
            onInput={type === 'tel' ? handleInputChange : null}
          >
            {fieldName === 'onlineScheduler' && (
              <p className="pt-2 text-sm text-hint">Please start your URL with https://</p>
            )}
          </TextField>
          <Checkbox
            className="mt-3"
            name={n('preferredContacts')}
            value={slug}
            control={control}
            isDisabled={!inputFields[fieldName]}
          >
            Preferred contact
          </Checkbox>
        </div>
      ))}
    </div>
  );
}

ContactFieldSet.toFormValue = (program) => ({
  email: program.email || '',
  mobile: program.mobile || '',
  admissionPhone: program.admissionPhone || '',
  onlineScheduler: program.onlineScheduler || '',
  preferredContacts: program.preferredContacts || [],
});

ContactFieldSet.toValueApi = ({
  email,
  mobile,
  onlineScheduler,
  preferredContacts,
  admissionPhone,
}) => {
  let patch = {
    email: null,
    mobile: null,
    onlineScheduler: null,
    admissionPhone: null,
  };

  if (email) patch.email = email;
  if (mobile) patch.mobile = mobile;
  if (onlineScheduler) patch.onlineScheduler = onlineScheduler;
  if (admissionPhone) patch.admissionPhone = admissionPhone;
  if (preferredContacts) {
    const excludedContacts = [];
    const allFields = [...fieldsProgram, ...fieldsProvider];

    Object.keys(patch).forEach((key) => {
      if (patch[key] === null) {
        const emptyField = allFields.find((field) => field.name === key);
        excludedContacts.push(emptyField.slug);
      }
    });

    patch.preferredContacts = preferredContacts.filter((item) => !excludedContacts.includes(item));
  }

  return patch;
};

ContactFieldSet.schema = object({
  email: string().email('Please enter a valid email address').required('This field is required'),
  mobile: string().test(
    'is-phone',
    'One phone number is required (e.g. 1 333 333 4444)',
    (mobile, { parent }) => {
      if (parent.admissionPhone !== '' || mobile !== '') {
        return validatePhone(mobile || parent.admissionPhone);
      }
    },
  ),
  admissionPhone: string().test(
    'is-phone',
    'One phone number is required (e.g. 1 333 333 4444)',
    (phone, { parent }) => {
      if (parent.mobile !== '' || phone !== '') {
        return validatePhone(phone || parent.mobile);
      }
    },
  ),
  onlineScheduler: string().url('Please enter a valid URL address').optional(),
  preferredContacts: array()
    .min(1, 'Please select at least one preferred contact')
    .required('Please select at least one preferred contact'),
});

ContactFieldSet.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  control: PropTypes.object,
};
