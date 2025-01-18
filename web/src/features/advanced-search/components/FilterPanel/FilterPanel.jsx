import { useScreen } from '@/core/hooks';
import { useProgramSearchFlag } from '@/modules/search/hooks';

import {
  AccessibilityFilter,
  AmenitiesFilter,
  AvailabilityFilter,
  EligibilityFilter,
  Filter,
  IdentityPreferencesFilter,
  IdentityPreferencesProviderFilter,
  MoreFilter,
  PaymentFilter,
  SpecialityFilter,
  SpecialityProviderFilter,
} from './Filters';
import {
  DesktopFilterForm,
  filterPanelDefaultProps,
  filterPanelPropTypes,
  MobileFilterForm,
} from './FilterForm';

export function FilterPanel(props) {
  const {
    query: { modes },
  } = props;
  let hasProgramsEnabled = useProgramSearchFlag();
  const hasOneModeType = Array.isArray(modes) && modes.length === 1;

  const hasPersonOnlyFilters = !hasProgramsEnabled || (hasOneModeType && modes?.includes('PERSON'));
  const hasProgramOnlyFilters = hasOneModeType && modes?.includes('PROGRAM');

  let Component = ProgramPersonFormFilter;
  if (hasPersonOnlyFilters) {
    Component = ProviderFilter;
  }
  if (hasProgramOnlyFilters) {
    Component = ProgramFormFilter;
  }

  return <Component {...props} />;
}

function ProgramFormFilter(props) {
  const isMediumScreen = useScreen('md');
  const Form = !isMediumScreen ? MobileFilterForm : DesktopFilterForm;

  return (
    <Form {...props}>
      <Filter
        id="eligibility"
        query={props.query}
        component={EligibilityFilter}
        label="Eligibility"
      />
      <Filter id="amenities" query={props.query} component={AmenitiesFilter} label="Amenities" />
      <Filter id="payments" query={props.query} component={PaymentFilter} label="Payment" />
      <Filter
        id="accessibility"
        query={props.query}
        component={AccessibilityFilter}
        label="Accessibility"
      />
      <Filter id="more" query={props.query} component={MoreFilter} label="More" />
    </Form>
  );
}

function ProviderFilter(props) {
  const isMediumScreen = useScreen('md');
  const Form = !isMediumScreen ? MobileFilterForm : DesktopFilterForm;
  return (
    <Form {...props}>
      <Filter
        id="specialties"
        query={props.query}
        component={SpecialityProviderFilter}
        label="Specialty"
      />
      <Filter id="payments" query={props.query} component={PaymentFilter} label="Payment" />
      <Filter
        id="availability"
        query={props.query}
        component={AvailabilityFilter}
        label="Availability"
      />
      <Filter
        id="identityPreferences"
        query={props.query}
        component={IdentityPreferencesProviderFilter}
        label="Identity preferences"
      />
      <Filter
        id="accessibility"
        query={props.query}
        component={AccessibilityFilter}
        label="Accessibility"
      />
    </Form>
  );
}

function ProgramPersonFormFilter(props) {
  const isMediumScreen = useScreen('md');
  const Form = !isMediumScreen ? MobileFilterForm : DesktopFilterForm;
  return (
    <Form {...props}>
      <Filter id="specialties" query={props.query} component={SpecialityFilter} label="Specialty" />
      <Filter id="payments" query={props.query} component={PaymentFilter} label="Payment" />
      <Filter
        id="availability"
        query={props.query}
        component={AvailabilityFilter}
        label="Availability"
      />
      <Filter
        id="IdentityPreferences"
        query={props.query}
        component={IdentityPreferencesFilter}
        label="Identity preferences"
      />
      <Filter id="amenities" query={props.query} component={AmenitiesFilter} label="Amenities" />
      <Filter
        id="accessibility"
        query={props.query}
        component={AccessibilityFilter}
        label="Accessibility"
      />
    </Form>
  );
}

FilterPanel.propTypes = {
  ...filterPanelPropTypes(),
};

FilterPanel.defaultProps = {
  ...filterPanelDefaultProps(),
};
