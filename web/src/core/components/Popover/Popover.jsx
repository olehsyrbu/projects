import { useRef } from 'react';
import { DismissButton, Overlay, usePopover } from 'react-aria';
import cn from 'classnames';

export function Popover({ children, state, className, ...props }) {
  let ref = useRef(null);
  let popoverRef = props.popoverRef || ref;
  let { popoverProps, underlayProps } = usePopover({ ...props, popoverRef }, state);

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0" />
      <div
        {...popoverProps}
        ref={popoverRef}
        className={cn('rounded-lg border bg-white', className)}
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
