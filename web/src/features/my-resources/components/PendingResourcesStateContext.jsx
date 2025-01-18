import { createContext, useReducer, useContext } from 'react';

let Context = createContext();

let initialState = {
  selected: new Set(),
  allSelected: false,
  selectedCount: 0,
  latestMessage: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'select': {
      if (state.allSelected || state.selected.has(action.resourceId)) {
        return state;
      }

      return {
        ...state,
        selected: new Set(state.selected).add(action.resourceId),
        selectedCount: state.selectedCount + 1,
      };
    }
    case 'deselect': {
      let newSelected = new Set(state.selected);
      let removed = newSelected.delete(action.resourceId);

      if (!removed) {
        return state;
      }

      return {
        ...state,
        selected: newSelected,
        selectedCount: state.selectedCount - 1,
      };
    }
    case 'select-all': {
      return {
        ...state,
        selected: new Set(),
        allSelected: true,
        selectedCount: action.count,
      };
    }
    case 'clear-selection': {
      return {
        ...state,
        selected: new Set(),
        allSelected: false,
        selectedCount: 0,
      };
    }
    case 'message-sent': {
      return {
        ...state,
        latestMessage: {
          recipientCount: action.recipientCount,
          sentAt: action.sentAt,
        },
      };
    }
    case 'clear-message': {
      return { ...state, latestMessage: null };
    }
    default:
      return state;
  }
}

export function PendingResourcesStateProvider({ children }) {
  let [state, dispatch] = useReducer(reducer, initialState);
  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
}

export function usePendingResourcesState() {
  return useContext(Context);
}
