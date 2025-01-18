import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { array, bool, object } from 'yup';
import PropTypes from 'prop-types';
import { useAuthContext } from '@/modules/auth';
import { Checkbox } from '@/modules/form';
import {
  AccommodationsFieldSet,
  AddButton,
  LocationFieldSet,
  RemoteFieldSet,
  RemoveButton,
} from '@/modules/program';
import { useUpdatePersonProviderProfile } from '@/core/api/ProviderQueries';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';
import { EditorActions } from '../EditorActions';
import { Warning16Regular as Warning } from '@fluentui/react-icons';
import { Alert } from '@/core/components';

const schema = object().shape({
  status: bool().when(['inPersonType', 'remoteType'], {
    is: (inPersonType, remoteType) => !inPersonType && !remoteType,
    then: (schema) => schema.required('Please select at least one location'),
  }),
  locations: array().when('inPersonType', { is: true, then: array(LocationFieldSet.schema) }),
  remote: object().when('remoteType', { is: true, then: RemoteFieldSet.providerSchema }),
});

export function ProviderLocation({ provider }) {
  const update = useUpdatePersonProviderProfile();
  let { user } = useAuthContext();
  let { locations, inPerson, remote } = provider;
  let locationsForm =
    locations.length > 0 ? LocationFieldSet.toFormValue(provider.locations) : [{}];

  locationsForm = locationsForm.map((location) => ({
    ...location,
    address: {
      ...location.address,
      address1: location.address?.address1,
      address2: location.address?.address2,
    },
  }));

  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isSubmitting, errors },
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      locations: locationsForm,
      accommodations: locations.map((loc) => loc.accommodations?.map(({ id }) => id) ?? []),
      inPersonType: inPerson?.available,
      remoteType: remote?.available,
      remote: remote ?? {},
    },
    resolver: yupResolver(schema),
  });

  const {
    fields,
    append,
    remove,
    update: updateLocation,
  } = useFieldArray({ name: 'locations', control });

  async function submit(values) {
    if (isDirty) {
      const { accommodations, locations, remote } = values;
      let patch = {
        locations: [],
        inPerson: { available: false },
        remote: { available: false, voice: false, chat: false, video: false },
      };

      if (inPersonType) {
        patch.inPerson = { available: true };
        patch.locations = locations.map((location, index) => ({
          ...LocationFieldSet.toApiValue(location),
          accommodations: accommodations[index],
        }));
      }
      if (remoteType) {
        patch.remote = {
          ...remote,
          available: true,
        };
      }

      await update(provider.id, patch, user);
      reset(values);
    }
  }

  let inPersonType = watch('inPersonType');
  let remoteType = watch('remoteType');

  return (
    <>
      <UnsavedDataPrompt when={isDirty} />
      {errors.status && !inPersonType && !remoteType && (
        <Alert
          className="mb-4 w-fit bg-warning-3"
          text={errors.status.message}
          icon={<Warning />}
        />
      )}

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-4 divide-x-0 divide-y-[1px] divide-solid divide-graphics-30"
      >
        <div className="space-y-4">
          <Checkbox className="items-center" name="inPersonType" control={control}>
            <span className="text-xl font-bold">In person</span>
          </Checkbox>
          {inPersonType && (
            <>
              <p>If you have multiple locations, please list them all.</p>
              <div className="divide-x-0 divide-y divide-solid divide-graphics-30">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="-mx-4 px-4 py-6 first:pt-0 last:pb-0 md:mx-0 md:px-0"
                  >
                    <LocationFieldSet
                      onClear={() =>
                        updateLocation(index, {
                          ...field.value,
                          ...LocationFieldSet.defaultLocation,
                        })
                      }
                      mode={provider.mode}
                      removable={fields.length > 1}
                      onRemove={() => remove(index)}
                      name={`locations.${index}`}
                      control={control}
                    />

                    <p className="mt-4 text-xl">
                      <span className="font-bold">Accommodations</span> (optional)
                    </p>

                    <p>Please check any accommodations you offer:</p>
                    <AccommodationsFieldSet
                      mode="PERSON"
                      name={`accommodations.${index}`}
                      control={control}
                    />

                    <div className="space-y-4">
                      <RemoveButton className="sm:hidden" onClick={() => remove(index)} />
                      {index === fields.length - 1 && (
                        <AddButton
                          onClick={() =>
                            append({
                              ...LocationFieldSet.defaultLocation,
                              accommodations: [],
                            })
                          }
                        >
                          Add another location
                        </AddButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div>
          <Checkbox className="mt-6 items-center" name="remoteType" control={control}>
            <span className="text-xl font-bold">Remote location</span>
          </Checkbox>
          {remoteType && <RemoteFieldSet providerMode name="remote" control={control} />}
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

ProviderLocation.propTypes = {
  provider: PropTypes.object,
};
