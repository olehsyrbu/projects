import { Suspense, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { boolean, object, string } from 'yup';
import { useStates } from '@/core/api/StatesQueries';
import { TooltipIcon } from '@/core/components/Tooltip';
import { useReferenceData } from '@/modules/reference-data';
import { PlaceAutocomplete } from '@/modules/geocoding/components/PlaceAutocomplete';
import { Checkbox, ReferenceDataSelect, TextField } from '@/modules/form';
import { SelectSkeleton } from './SelectSkeleton';
import { AddButton, ClearButton, RemoveButton } from './ActionButtons';

export function LocationFieldSet({ control, name, removable, onRemove, mode, onClear }) {
  let [addressMode, setAddressMode] = useState('autocomplete');
  let addressListRef = useRef();

  let clear = () => {
    if (addressListRef.current) {
      addressListRef.current.setFilterText('');
    }
    onClear();
  };

  return (
    <div role="group" className="space-y-4">
      <div className="max-w-[413px] sm:flex sm:space-x-4">
        <Suspense fallback={<SelectSkeleton className="flex-1" />}>
          <FacilityTypeSelect
            mode={mode}
            label="Facility type (optional)"
            name={`${name}.facilityType`}
            className="sm:!w-64"
            control={control}
          />
        </Suspense>
        {onClear && <ClearButton onClick={clear} className="hidden sm:inline-flex" />}
        {removable && <RemoveButton className="hidden sm:inline-flex" onClick={onRemove} />}
      </div>
      {addressMode === 'autocomplete' && (
        <div className="items-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
          <div className="max-w-[413px] flex-1 bg-background">
            <PlaceAutocompleteController
              data-testid="address-input"
              label="Address"
              name={`${name}.address`}
              onSelectAddress={(address) => {
                /**
                 * Sometimes Places API doesn't provide complete address details. In this case,
                 * switch to manual mode to let user see missing fields.
                 * */
                if (!address.address1 || !address.city || !address.zip || !address.state) {
                  setAddressMode('manual');
                }
              }}
              listRef={addressListRef}
              control={control}
            />
          </div>
          <AddButton onClick={() => setAddressMode('manual')}>Add manually</AddButton>
        </div>
      )}
      <div className="max-w-[413px] space-y-4">
        {addressMode === 'manual' && (
          <>
            <TextField label="Address line 1" name={`${name}.address.address1`} control={control} />
            <TextField
              label="Address line 2 (optional)"
              name={`${name}.address.address2`}
              control={control}
            />
            <TextField label="City" name={`${name}.address.city`} control={control} />
            <div className="space-y-4 sm:flex sm:space-x-6 sm:space-y-0">
              <Suspense fallback={<SelectSkeleton className="w-full" />}>
                <StateSelect
                  label="State"
                  name={`${name}.address.state`}
                  className="basis-[150px]"
                  control={control}
                />
              </Suspense>
              <TextField
                label="Zip code"
                name={`${name}.address.zip`}
                inputClassName="flex-1"
                control={control}
              />
            </div>
          </>
        )}

        <div className="flex items-center">
          <Checkbox name={`${name}.hide`} control={control}>
            Hide full address in search
          </Checkbox>
          <TooltipIcon
            label="Your full address will not be displayed on your profile. It will only be used to calculate the distance for potential clients/patients who want to meet you in-person."
            classNameIcon="ml-1"
          />
        </div>

        <TextField label="Facility Name (optional)" name={`${name}.name`} control={control} />

        {onClear && <ClearButton onClick={clear} className="sm:hidden" />}
      </div>
    </div>
  );
}

LocationFieldSet.propTypes = {
  mode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  removable: PropTypes.bool,
  control: PropTypes.object,
  onRemove: PropTypes.func,
  onClear: PropTypes.func,
};

LocationFieldSet.defaultLocation = {
  facilityType: '',
  address: {
    address1: '',
    address2: '',
    city: '',
    state: null,
    zip: '',
  },
  name: '',
  hide: false,
};

LocationFieldSet.schema = object({
  facilityType: object().nullable(),
  address: object({
    address1: string().required('This field is required'),
    address2: string().nullable(),
    city: string().required('This field is required'),
    zip: string().required('This field is required'),
    state: object().nullable().required('This field is required'),
  }),
  name: string().nullable(),
  hide: boolean(),
});

LocationFieldSet.toFormValue = (locations) =>
  locations.map((location) => ({
    ...location,
    address: {
      ...location.address,
    },
  }));

LocationFieldSet.toApiValue = (location) => {
  let { address1, address2, city, zip, state } = location.address;

  return {
    id: location.id,
    facilityType: location.facilityType?.id,
    address: {
      address1,
      address2,
      city,
      zip,
      state: state.id,
    },
    name: location.name,
    phone: location.phone,
    admissionPhone: location.admissionPhone,
    hide: location.hide,
  };
};

function PlaceAutocompleteController({ name, control, ...rest }) {
  let { field, fieldState } = useController({ name, control });

  return (
    <PlaceAutocomplete
      {...rest}
      initialAddress={field.value}
      onSelectAddress={(address) => {
        field.onChange(address);
        if (rest.onSelectAddress) rest.onSelectAddress(address);
      }}
      invalid={fieldState.invalid}
      errorMessage={fieldState.invalid ? 'This field is required' : null}
    />
  );
}

function FacilityTypeSelect(props) {
  let facilityTypes = useReferenceData('FacilityType', { types: [props.mode] });
  return <ReferenceDataSelect {...props} options={facilityTypes} />;
}

FacilityTypeSelect.propTypes = {
  mode: PropTypes.string,
};

function StateSelect(props) {
  let states = useStates();
  return <ReferenceDataSelect {...props} options={states} />;
}

PlaceAutocompleteController.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
};
