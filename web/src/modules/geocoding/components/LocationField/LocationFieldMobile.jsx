import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Suspense, useEffect, useState } from 'react';
import { useDebounce } from '@/core/hooks';
import { fetchLocationDetail, fetchLocationSuggestions } from '@/core/api/MapsAPI';
import { Combobox } from '@reach/combobox';
import { Select } from '@/core/components/Select';
import SuggestionList from './SuggestionList';
import useSWR from 'swr';

export function LocationFieldMobile({
  inputNoBorder,
  shouldFetchPlaces,
  onChangeLocation,
  onSelectLocation,
  defaultValue,
  required,
  invalid,
  inlineError,
  errorMessage,
  placeholder,
  label,
}) {
  let { field, fieldState } = useController({
    name: 'location',
    defaultValue,
    rules: { required: required },
  });

  let { value, onChange } = field;
  const { error } = fieldState;

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestions, setIsSuggestions] = useState(false);
  let debounced = useDebounce(value, 350);

  const { data: suggestions } = useSWR(
    ['location-suggestions', debounced],
    () => fetchLocationSuggestions({ query: debounced }),
    { suspense: false },
  );

  useEffect(() => {
    setShowSuggestions(!isSuggestions && debounced && value === debounced);
  }, [debounced]);

  function preventReloadWithSafari13(event) {
    event.preventDefault();
  }

  function submitModal(event) {
    event.stopPropagation();
    preventReloadWithSafari13(event);
  }

  async function getPlaceDetails(placeId) {
    return await fetchLocationDetail({ placeId });
  }

  async function handleSelectSuggestion({ description, place_id }) {
    if (shouldFetchPlaces) {
      try {
        const data = await getPlaceDetails(place_id);
        onSelectLocation(data);
      } catch (e) {
        console.error('error in suggestion list', e);
      }
    }
    if (onChangeLocation) {
      onChangeLocation(description);
    }

    onChange(description);
    setShowSuggestions(false);
    setIsSuggestions(true);
  }

  function handleInputChanged(value) {
    if (onChangeLocation) {
      onChangeLocation(value);
    }
    onChange(value);
    setIsSuggestions(false);
  }

  return (
    <Combobox
      as="form"
      style={{ display: 'flex', flexDirection: 'column' }}
      onSelect={onChange}
      onSubmit={submitModal}
      data-testid="address"
    >
      <span className="sr-only">{label}</span>
      <Select
        inputNoBorder={inputNoBorder}
        invalid={invalid || error}
        inputText={value}
        onInputChanged={handleInputChanged}
        label="Address"
        placeholder={placeholder}
        isShowChevron={false}
        MenuList={() =>
          showSuggestions && (
            <Suspense fallback={null}>
              <SuggestionList
                suggestions={suggestions}
                query={debounced}
                onSelect={handleSelectSuggestion}
              />
            </Suspense>
          )
        }
      />
      {!inlineError && (invalid || error) && errorMessage && (
        <span className="text-center text-sm text-error-1" role="alert">
          {errorMessage}
        </span>
      )}
    </Combobox>
  );
}

LocationFieldMobile.defaultProps = {
  placeholder: 'Add your city, zip, or address',
};
LocationFieldMobile.propTypes = {
  inlineError: PropTypes.bool,
  onSelectLocation: PropTypes.func,
  onChangeLocation: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  required: PropTypes.bool,
  shouldFetchPlaces: PropTypes.bool,
  inputNoBorder: PropTypes.bool,
  invalid: PropTypes.bool,
};
