import PropTypes from 'prop-types';
import { useFieldArray } from 'react-hook-form';
import { array, lazy, object, string } from 'yup';
import { isEqual } from 'lodash-es';

import { ReferenceDataSelect, TextArea, TextField } from '@/modules/form';
import { AddButton, RemoveButton } from '@/modules/program';
import { useReferenceData } from '@/modules/reference-data';
import { SelectYear } from './SelectYear';
import { ClearButton } from './ActionButtons';

const defaultEducation = {
  education: null,
  graduationYear: null,
  schoolName: '',
  comment: '',
};

export function EducationFieldSet({ control, name }) {
  const educationsRefData = useReferenceData('Education');
  const { fields, append, remove, update } = useFieldArray({ control, name });

  return (
    <div className="space-y-6">
      <div className="divide-x-0 divide-y-[1px] divide-solid divide-graphics-30">
        {fields.map((education, index) => (
          <div
            className="flex flex-col items-start gap-x-4 py-6 first:pt-0 last:pb-0 md:flex-row"
            key={education.id}
          >
            <fieldset className="flex  w-full flex-col gap-4 md:max-w-md" key={index}>
              <ReferenceDataSelect
                options={educationsRefData}
                control={control}
                name={`${name}.${index}.education`}
                label="Education type"
              />
              <TextField
                label="School name"
                name={`${name}.${index}.schoolName`}
                control={control}
              />
              <SelectYear label="Year" control={control} name={`${name}.${index}.graduationYear`} />
              <TextArea
                maxLength={154}
                placeholder="You might add the focus of your education here. For example, 'I studied the impact of racism on mental health.'"
                name={`${name}.${index}.comment`}
                control={control}
              />
            </fieldset>
            <div className="flex w-full space-x-2 pt-4 md:w-28 md:pt-0">
              <ClearButton onClick={() => update(index, { ...defaultEducation })} />
              {fields.length > 1 && <RemoveButton onClick={() => remove(index)} />}
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={() => append({ ...defaultEducation })}>
        <span className="hidden md:block">Add another education</span>
        <span className="md:hidden">Add education</span>
      </AddButton>
    </div>
  );
}

EducationFieldSet.toFormValue = (educations) => {
  return educations.length > 0
    ? educations?.map(({ graduationYear, ...rest }) => ({
        graduationYear: { value: graduationYear, label: graduationYear },
        ...rest,
      }))
    : [defaultEducation];
};

EducationFieldSet.toValueApi = (educations) =>
  educations.length > 0
    ? educations
        .filter((item) => item.graduationYear && item.schoolName)
        .map(({ id, graduationYear, education, ...rest }) => ({
          ...rest,
          educationId: education.id,
          graduationYear: +graduationYear.value,
        }))
    : [];

EducationFieldSet.schema = () =>
  lazy((educations) => {
    const schema = array();

    if (educations.length === 1 && isEqual(educations[0], defaultEducation)) {
      return schema;
    }

    const msg = 'This field is required';
    return schema.of(
      object().shape(
        {
          schoolName: string()
            .ensure()
            .when(['graduationYear', 'comment', 'education'], {
              is: (education, graduationYear, comment) => education || graduationYear || comment,
              then: (schema) => schema.required(msg),
            }),

          education: object()
            .nullable()
            .when(['graduationYear', 'schoolName', 'comment'], {
              is: (graduationYear, schoolName, comment) => graduationYear || schoolName || comment,
              then: (schema) => schema.required(msg),
            }),
          graduationYear: object()
            .nullable()
            .when(['education', 'schoolName', 'comment'], {
              is: (education, schoolName, comment) => education || schoolName || comment,
              then: (schema) => schema.required(msg),
            }),
        },
        [
          ['education', 'schoolName', 'graduationYear'],
          ['graduationYear', 'schoolName', 'comment'],
          ['education', 'schoolName', 'comment'],
          ['education', 'graduationYear', 'comment'],
        ],
      ),
    );
  });

EducationFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
