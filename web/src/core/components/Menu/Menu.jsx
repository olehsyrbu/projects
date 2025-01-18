import {
  MenuTrigger,
  Button,
  Popover,
  Menu as AriaMenu,
  Item as AriaItem,
  Separator as AriaSeparator,
} from 'react-aria-components';

function Menu({ className, ...props }) {
  return (
    <Popover
      placement="bottom right"
      className={`rounded-lg border border-light bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] ${className}`}
    >
      <AriaMenu className="py-2 outline-none" {...props} />
    </Popover>
  );
}

Menu.propTypes = AriaMenu.propTypes;

function MenuItem({ className, ...props }) {
  return (
    <AriaItem
      {...props}
      className={`cursor-pointer px-4 py-2 font-normal text-p-100 outline-none focus:bg-p-10 ${className}`}
    />
  );
}

MenuItem.propTypes = AriaItem.propTypes;

function Separator() {
  return <AriaSeparator className="h-[1px] bg-n-40" />;
}
Separator.propTypes = AriaSeparator.propTypes;

export { MenuTrigger, MenuItem, Button, Menu, Separator };
