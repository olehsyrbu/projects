import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';

import mixpanel from '@/core/mixpanel';
import { Search24Filled as Search } from '@fluentui/react-icons';
import { useTherapeuticAreas, useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { LocationField } from '@/modules/geocoding/components';
import {
  SEARCH_CATEGORIES,
  SEARCH_MODES_PERSON,
  SEARCH_MODES_PROGRAM,
  SEARCH_MODES_ALL,
  SEARCH_WORK_SETTING,
} from '@/modules/search/utils';
import {
  CategoryField,
  GlobalField,
  ProgramTypesField,
  SettingField,
  SpecialtiesField,
} from './fields';

import './SearchBar.css';

export function SearchBar(props) {
  const {
    location,
    setting,
    specialties,
    query,
    onSubmit,
    renderCategoryField,
    programTypes,
    centered,
  } = props;
  const form = useForm({
    defaultValues: {
      category: props.category,
      location,
      setting,
      specialties,
      query,
      programTypes,
    },
  });
  const { watch, handleSubmit } = form;
  const category = watch('category');

  // TODO: MIR-4927
  useTherapeuticAreas();
  useProgramTypes();

  useEffect(() => {
    form.setValue('location', location);
    form.setValue('specialties', specialties);
    form.setValue('setting', setting);
    form.setValue('query', query);
    form.setValue('programTypes', programTypes);
  }, [location, setting, specialties, query, programTypes]);

  useEffect(() => {
    if (props.category !== category) {
      form.setValue('category', props.category);
    }
  }, [props.category]);

  useEffect(() => {
    form.setValue('query', query);
    if (category === SEARCH_CATEGORIES.BY_NAME) {
      form.unregister('location');
      form.setValue('setting', SearchBar.defaultProps.setting);
      form.setValue('specialties', SearchBar.defaultProps.specialties);
      form.setValue('programTypes', SearchBar.defaultProps.programTypes);
    }
  }, [category]);

  function handleSearchBarSubmit(values) {
    let { category, location, setting, programTypes, specialties, query } = values;

    let search = {
      category,
      specialties: [],
      location: '',
      query: '',
      modes: [],
      setting: SEARCH_WORK_SETTING.BOTH,
      programTypes: [],
    };

    switch (category) {
      case 'provider':
        Object.assign(search, { modes: SEARCH_MODES_PERSON, location, setting, specialties });
        break;
      case 'program':
        Object.assign(search, { modes: SEARCH_MODES_PROGRAM, location, programTypes, specialties });
        break;
      case 'all':
        Object.assign(search, { modes: SEARCH_MODES_ALL, location, specialties });
        break;
      case 'by-name':
        Object.assign(search, { modes: SEARCH_MODES_ALL, query });
        break;
      default:
        break;
    }

    mixpanel.track('Search Bar Submit', search);

    onSubmit(search);
  }

  function handleCategoryChange(next) {
    mixpanel.track('Search Bar Category Change', { category: next });
  }

  return (
    <FormProvider {...form}>
      <form role="search" className="SearchBar" onSubmit={handleSubmit(handleSearchBarSubmit)}>
        <CategoryField
          centered={centered}
          renderCategoryField={renderCategoryField}
          onChange={handleCategoryChange}
        />
        <div className="relative">
          <div className="panel">
            {category === 'provider' && (
              <>
                <SearchLocationField defaultValue={location} />
                <SettingField />
                <SpecialtiesField />
              </>
            )}
            {category === 'program' && (
              <>
                <SearchLocationField defaultValue={location} />
                <ProgramTypesField />
                <SpecialtiesField />
              </>
            )}
            {category === 'all' && (
              <>
                <SearchLocationField defaultValue={location} />
                <SpecialtiesField />
              </>
            )}
            {category === 'by-name' && <GlobalField />}
          </div>
          <button
            type="submit"
            className="absolute z-[2] rounded-full bg-p-100 pl-6 pr-8 text-white hover:bg-p-120 max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:h-[42px] md:right-3 md:top-3 md:h-12"
          >
            <Search className="mr-2" />
            <span className="font-medium">Search</span>
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

SearchBar.propTypes = {
  category: PropTypes.oneOf(Object.values(SEARCH_CATEGORIES)),
  location: PropTypes.string,
  setting: PropTypes.oneOf(Object.values(SEARCH_WORK_SETTING)),
  specialties: PropTypes.arrayOf(PropTypes.string),
  programTypes: PropTypes.arrayOf(PropTypes.string),
  query: PropTypes.string,
  onSubmit: PropTypes.func,
  renderCategoryField: PropTypes.func,
  centered: PropTypes.bool,
};

SearchBar.defaultProps = {
  category: SEARCH_CATEGORIES.PROVIDER,
  location: '',
  setting: SEARCH_WORK_SETTING.BOTH,
  specialties: [],
  programTypes: [],
  query: '',
  onSubmit: () => {},
};

function SearchLocationField({ defaultValue }) {
  return (
    <LocationField
      required
      inputNoBorder
      defaultValue={defaultValue}
      inlineError
      errorMessage="This field is required"
      placeholder="Add your city, zip, or address"
      comboBoxStyle={{ flexBasis: 285 }}
    >
      <p className="field-label">Location</p>
    </LocationField>
  );
}

SearchLocationField.propTypes = {
  defaultValue: PropTypes.string,
};
