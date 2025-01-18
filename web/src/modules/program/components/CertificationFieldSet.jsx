import { useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import { array, lazy, object, string } from 'yup';
import { isEmpty, isEqual } from 'lodash-es';
import { TextArea, TextField } from '@/modules/form';
import { AddButton, ClearButton, RemoveButton } from './ActionButtons';

const defaultCertification = { authority: '', name: '', description: '' };

export function CertificationFieldSet({ control, name }) {
  const { fields, append, remove, update } = useFieldArray({ control, name });
  return (
    <div className="space-y-6">
      <div className="divide-x-0 divide-y-[1px] divide-solid divide-graphics-30">
        {fields.map((field, index) => (
          <div
            className="flex flex-col items-start gap-x-4 py-6 first:pt-0 last:pb-0 md:flex-row"
            key={field.id}
          >
            <fieldset className="flex w-full flex-col gap-4 md:max-w-md">
              <TextField
                label="Name of authority"
                name={`${name}.${index}.authority`}
                control={control}
              />
              <TextField
                label="Name of Certification / Specialization"
                name={`${name}.${index}.name`}
                control={control}
              />
              <TextArea
                minRows={3}
                maxRows={8}
                maxLength={500}
                placeholder="Description (optional)"
                name={`${name}.${index}.description`}
                control={control}
              />
            </fieldset>
            <div className="flex w-full space-x-2 pt-4 md:w-28 md:pt-0">
              <ClearButton onClick={() => update(index, { ...defaultCertification })} />
              {fields.length > 1 && <RemoveButton onClick={() => remove(index)} />}
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={() => append({ ...defaultCertification })}>
        <span className="hidden md:block">Add another certification</span>
        <span className="md:hidden">Add certification</span>
      </AddButton>
    </div>
  );
}

CertificationFieldSet.toValueApi = (certifications) =>
  certifications
    .filter(({ name, authority, description }) => {
      if (name?.length > 0 && authority?.length > 0) return { name, authority, description };
    })
    .map(({ id, ...c }) => c);

CertificationFieldSet.schema = () =>
  lazy((certifications) => {
    const schema = array();

    if (CertificationFieldSet.isEmpty(certifications)) {
      return schema;
    }

    const msg = 'This field is required';
    return schema.of(
      object({
        name: string().test('name', msg, (_, ctx) => {
          const { name, authority } = ctx.parent;
          return name?.length > 0 || authority?.length === 0;
        }),
        authority: string().test('authority', msg, (_, ctx) => {
          const { name, authority } = ctx.parent;
          return name?.length === 0 || authority?.length > 0;
        }),
        description: string(),
      }),
    );
  });

CertificationFieldSet.toFormValue = (certifications) => {
  if (certifications && !isEmpty(certifications)) {
    return certifications;
  }

  return [defaultCertification];
};

CertificationFieldSet.isEmpty = (certifications) =>
  certifications.length === 1 && isEqual(certifications[0], defaultCertification);

CertificationFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
