import PropTypes from 'prop-types';
import { ComboboxList, ComboboxOption } from '@reach/combobox';
import { noop } from '@/core/utils';

function SuggestionList({ suggestions, onSelect }) {
  return suggestions?.length ? (
    <ComboboxList className="mir-option-list">
      {suggestions.map((suggestion) => (
        <ComboboxOption
          className="mir-option-list-item"
          key={suggestion.place_id}
          value={suggestion.description}
          onClick={() => onSelect(suggestion)}
        />
      ))}
    </ComboboxList>
  ) : (
    <span className="mir-dropdown-empty">No suggestions</span>
  );
}

SuggestionList.propTypes = {
  onSelect: PropTypes.func,
};

SuggestionList.defaultProps = {
  onSelect: noop,
};

export default SuggestionList;
