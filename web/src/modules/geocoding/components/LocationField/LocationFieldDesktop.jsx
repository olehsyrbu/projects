import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { Combobox, ComboboxInput, ComboboxPopover } from '@reach/combobox';

import { useDebounce } from '@/core/hooks';
import { fetchLocationDetail, fetchLocationSuggestions } from '@/core/api/MapsAPI';
import SuggestionList from './SuggestionList';
import useSWR from 'swr';

export function LocationFieldDesktop({
  id,
  shouldFetchPlaces,
  placeholder,
  onSelectLocation,
  onChangeLocation,
  comboBoxStyle,
  label,
  defaultValue,
  errorMessage,
  invalid,
  required,
  openOnFocus,
  children,
  inlineError,
}) {
  let { field, fieldState } = useController({
    name: id ? `location ${id}` : 'location',
    defaultValue,
    rules: { required: required },
  });
  let { value, onChange } = field;
  const { error } = fieldState;

  let debounced = useDebounce(value, 350);

  const { data: suggestions } = useSWR(
    ['location-suggestions', debounced],
    () => fetchLocationSuggestions({ query: debounced }),
    { suspense: false },
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestions, setIsSuggestions] = useState(false);

  const inputBoxClasses = 'field input-text';
  const inputClasses = cn('field-input location', {
    'border-error': (error || invalid) && errorMessage,
    'placeholder:!text-error-1': inlineError && (error || invalid),
  });

  useEffect(() => {
    if (defaultValue !== value) {
      onChange(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    setShowSuggestions(!isSuggestions && debounced && value === debounced);
  }, [debounced]);

  function handleOnChangeInput(event) {
    if (onChangeLocation) {
      onChangeLocation(event.target.value);
      onChange(event.target.value);
    } else {
      onChange(event.target.value);
    }
    setIsSuggestions(false);
  }

  async function getPlaceDetails(placeId) {
    return await fetchLocationDetail({ placeId });
  }

  async function onSelectSuggestion(description) {
    const suggestion = suggestions?.find((s) => s.description === description);
    const place_id = suggestion?.place_id;

    if (shouldFetchPlaces && onSelectLocation && place_id) {
      try {
        const data = await getPlaceDetails(place_id);
        onSelectLocation(data);
      } catch (e) {
        console.error('error in suggestion list', e);
      }
    } else {
      onChange(description);

      if (onChangeLocation) {
        onChangeLocation(description);
      }
    }
    setIsSuggestions(true);
    setShowSuggestions(false);
  }

  return (
    <Combobox
      as="div"
      className={inputBoxClasses}
      style={comboBoxStyle}
      openOnFocus={openOnFocus}
      onSelect={onSelectSuggestion}
    >
      {children}
      <ComboboxInput
        data-testid="address"
        placeholder={placeholder}
        className={inputClasses}
        autocomplete="off"
        value={value}
        onChange={handleOnChangeInput}
      />
      {label && (
        <label aria-hidden="true" htmlFor={id} className={cn('label', { 'text-error': error })}>
          {label}
        </label>
      )}
      {!inlineError && (invalid || error) && errorMessage && (
        <span className="error-message" role="alert">
          {errorMessage}
        </span>
      )}
      {showSuggestions && suggestions ? (
        <ComboboxPopover className="mir-dropdown" portal={false} as="div">
          <SuggestionList suggestions={suggestions} />
        </ComboboxPopover>
      ) : null}
    </Combobox>
  );
}

LocationFieldDesktop.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeLocation: PropTypes.func,
  onSelectLocation: PropTypes.func,
  comboBoxStyle: PropTypes.object,
  defaultValue: PropTypes.string,
  errorMessage: PropTypes.string,
  invalid: PropTypes.bool,
  shouldFetchPlaces: PropTypes.bool,
  openOnFocus: PropTypes.bool,
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  inlineError: PropTypes.bool,
};

LocationFieldDesktop.defaultProps = {
  required: false,
  openOnFocus: true,
};
