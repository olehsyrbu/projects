import { noop } from '@/core/utils';
import { SEARCH_CATEGORIES } from '@/modules/search/utils';
import PropType from 'prop-types';
import PropTypes from 'prop-types';

export function filterPanelPropTypes() {
  return {
    query: PropTypes.object,
    onApply: PropType.func,
    onClearAll: PropType.func,
    onClear: PropType.func,
    onDismiss: PropType.func,
    onChange: PropTypes.func,
    children: PropTypes.node,
  };
}

export function filterPanelDefaultProps() {
  return {
    query: {
      category: SEARCH_CATEGORIES.PROVIDER,
      modes: [],
    },
    onApply: noop,
    onClearAll: noop,
    onDismiss: noop,
    onClear: noop,
    onChange: noop,
  };
}
