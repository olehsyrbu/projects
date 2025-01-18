import PropTypes from 'prop-types';
import { useFieldArray } from 'react-hook-form';
import { array, lazy, object, string } from 'yup';

import { AddButton, RemoveButton } from '@/modules/program';
import { TextArea, TextField } from '@/modules/form';
import { isEqual } from 'lodash-es';
import { SelectYear } from './SelectYear';
import { ClearButton } from './ActionButtons';

const defaultPublication = {
  title: '',
  description: '',
  publicationIn: '',
  doi: '',
  url: null,
  publicationDate: null,
};

export function PublicationFieldSet({ control, name }) {
  const { fields, append, remove, update } = useFieldArray({ control, name });
  return (
    <div className="space-y-6">
      <div className="divide-x-0 divide-y-[1px] divide-solid divide-graphics-30">
        {fields.map((publication, index) => (
          <div
            className="flex flex-col items-start gap-x-4 py-6 first:pt-0 last:pb-0 md:flex-row"
            key={publication.id}
          >
            <fieldset className="flex  w-full flex-col gap-4 md:max-w-md" key={index}>
              <TextField label="Title" name={`${name}.${index}.title`} control={control} />
              <TextArea
                maxLength={154}
                placeholder="Consider including a shortened version of the abstract."
                name={`${name}.${index}.description`}
                control={control}
              />
              <SelectYear
                label="Year"
                control={control}
                name={`${name}.${index}.publicationDate`}
              />
              <TextField
                label="Journal name"
                name={`${name}.${index}.publicationIn`}
                control={control}
              />
              <TextField label="DOI" name={`${name}.${index}.doi`} control={control} />
              <TextField label="URL" name={`${name}.${index}.url`} control={control}>
                <p className="pt-2 text-sm text-hint">Please start your URL with https://</p>
              </TextField>
            </fieldset>
            <div className="flex w-full space-x-2 pt-4 md:w-28 md:pt-0">
              <ClearButton onClick={() => update(index, { ...defaultPublication })} />
              {fields.length > 1 && <RemoveButton onClick={() => remove(index)} />}
            </div>
          </div>
        ))}
      </div>
      <div className="md:mt-6">
        <AddButton onClick={() => append({ ...defaultPublication })}>
          <span className="hidden md:block">Add another publication</span>
          <span className="md:hidden">Add publication</span>
        </AddButton>
      </div>
    </div>
  );
}

PublicationFieldSet.isEmpty = (publications) =>
  publications.length === 1 && isEqual(publications[0], defaultPublication);

PublicationFieldSet.schema = () =>
  lazy((publications) => {
    const schema = array();

    if (PublicationFieldSet.isEmpty(publications)) {
      return schema;
    }

    const msg = 'This field is required';
    return schema.of(
      object().shape(
        {
          title: string()
            .ensure()
            .when(['publicationIn', 'publicationDate', 'description', 'doi', 'url'], {
              is: (publicationIn, publicationDate, description, doi, url) =>
                publicationIn || publicationDate || description || doi || url,
              then: (schema) => schema.required(msg),
            }),
          publicationIn: string()
            .ensure()
            .when(['title', 'publicationDate', 'description', 'doi', 'url'], {
              is: (title, publicationDate, description, doi, url) =>
                title || publicationDate || description || doi || url,
              then: (schema) => schema.required(msg),
            }),
          publicationDate: object()
            .nullable()
            .when(['title', 'publicationIn', 'description', 'doi', 'url'], {
              is: (title, publicationIn, description, doi, url) =>
                title || publicationIn || description || doi || url,
              then: (schema) => schema.required(msg),
            }),
          url: string().url('should be valid URL').nullable(),
        },
        [
          ['publicationIn', 'publicationDate', 'description', 'doi', 'url'],
          ['title', 'publicationDate', 'description', 'doi', 'url'],
          ['title', 'publicationIn', 'description', 'doi', 'url'],
        ],
      ),
    );
  });

PublicationFieldSet.toValueApi = (publications) =>
  publications.length > 0
    ? publications
        .filter((item) => item.title)
        .map(({ id, publicationDate, ...publication }) => ({
          ...publication,
          publicationDate: publicationDate.value,
        }))
    : [];

PublicationFieldSet.toFormValue = (publications) => {
  return publications.length > 0
    ? publications?.map(({ publicationDate, ...rest }) => ({
        ...rest,
        publicationDate: { value: publicationDate, label: publicationDate },
      }))
    : [defaultPublication];
};

PublicationFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
