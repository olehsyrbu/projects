import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  DismissButton,
  FocusScope,
  mergeProps,
  useComboBox,
  useFocusRing,
  useListBox,
  useOption,
  useOverlay,
  useOverlayPosition,
} from 'react-aria';
import { Item, useAsyncList, useComboBoxState } from 'react-stately';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { TextField } from '@/core/components/TextField';
import { fetchPlaceDetails, fetchPlacePredictions } from '@/core/api/MapsAPI';
import { useStates } from '@/core/api/StatesQueries';

export function PlaceAutocomplete({ initialAddress, onSelectAddress, listRef, ...props }) {
  let states = useStates();

  let list = useAsyncList({
    initialFilterText: toAddressString(initialAddress),
    async load({ filterText }) {
      let items = await fetchPlacePredictions(filterText);
      return { items };
    },
  });

  useImperativeHandle(listRef, () => list);

  return (
    <Combobox
      {...props}
      items={list.items}
      inputValue={list.filterText}
      allowsCustomValue
      onInputChange={list.setFilterText}
      onSelectionChange={async (placeId) => {
        if (!placeId) return;
        let details = await fetchPlaceDetails({ placeId, fields: ['address_component'] });
        onSelectAddress(toAddressObject(details.address_components, states));
      }}
    >
      {(item) => <Item key={item.place_id}>{item.description}</Item>}
    </Combobox>
  );
}

function Combobox(props) {
  let inputRef = useRef();
  let popoverRef = useRef();
  let listBoxRef = useRef();

  let state = useComboBoxState(props);
  let { inputProps, listBoxProps } = useComboBox(
    { ...props, inputRef, popoverRef, listBoxRef },
    state,
  );

  let { overlayProps: positionProps } = useOverlayPosition({
    targetRef: inputRef,
    overlayRef: popoverRef,
    placement: 'bottom left',
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <div className="group relative">
      <TextField
        {...inputProps}
        ref={inputRef}
        label={props.label}
        invalid={props.validationState === 'invalid'}
        errorMessage={props.errorMessage}
      />
      {state.isOpen && (
        <Popover {...positionProps} ref={popoverRef} isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...listBoxProps} ref={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
}

let Popover = forwardRef((props, ref) => {
  let { isOpen, onClose, children, ...rest } = props;
  let { overlayProps } = useOverlay(
    { isOpen, onClose, shouldCloseOnBlur: true, isDismissable: false },
    ref,
  );
  return (
    <FocusScope restoreFocus>
      <div
        {...rest}
        {...overlayProps}
        ref={ref}
        className="rounded-lg border border-solid border-graphics-30 bg-white shadow-lg"
      >
        {props.children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
});

let ListBox = forwardRef(({ state, ...props }, ref) => {
  let { listBoxProps } = useListBox(props, state, ref);

  return (
    <ul {...listBoxProps} ref={ref} className="m-0 list-none p-0 py-2">
      {Array.from(state.collection).map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
});

function Option({ item, state }) {
  let ref = useRef();
  let { optionProps, isFocused, isPressed } = useOption({ key: item.key }, state, ref);
  let { focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      className={cn('cursor-pointer px-3 py-1 text-base hover:bg-p-10', {
        'bg-p-10': isFocused,
        'bg-p-20': isPressed,
      })}
    >
      {item.rendered}
    </li>
  );
}

function toAddressString(address) {
  let { address1, address2, city, state, zip } = address ?? {};
  return [address2 ? `${address1} ${address2}` : address1, city, state?.code, zip]
    .filter(Boolean)
    .join(', ');
}

function toAddressObject(components, states) {
  let findValue = (type, property = 'long_name') => {
    let component = components.find((c) => c.types.includes(type));
    return component?.[property] ?? '';
  };

  let stateCode = findValue('administrative_area_level_1', 'short_name');

  return {
    address1: [findValue('street_number'), findValue('route')].filter(Boolean).join(' '),
    address2: findValue('subpremise'),
    city: findValue('locality'),
    state: states.find((s) => s.code === stateCode),
    zip: findValue('postal_code'),
  };
}

PlaceAutocomplete.propTypes = {
  initialAddress: PropTypes.shape({
    address1: PropTypes.string.isRequired,
    address2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }).isRequired,
    zip: PropTypes.string.isRequired,
  }),
  onSelectAddress: PropTypes.func,
  listRef: PropTypes.object,
};

Combobox.propTypes = {
  label: PropTypes.string,
  validationState: PropTypes.oneOf(['valid', 'invalid']).isRequired,
  errorMessage: PropTypes.string,
};

Popover.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

ListBox.propTypes = {
  state: PropTypes.shape({
    collection: PropTypes.object,
  }),
};

Option.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    rendered: PropTypes.node,
  }),
  state: PropTypes.shape({}),
};
