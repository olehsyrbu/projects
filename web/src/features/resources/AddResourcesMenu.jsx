import PropTypes from 'prop-types';
import { Menu, MenuItem, MenuTrigger, Button } from '@/core/components';
import { Settings20Filled as SettingsSvg } from '@fluentui/react-icons';

export function AddResourcesMenu({ onMenuAction }) {
  return (
    <MenuTrigger>
      <Button
        aria-label="Menu"
        className={`group hidden h-10 w-10 rounded-lg border border-p-100 text-p-100 ring-p-100 focus-visible:outline-none focus-visible:ring-2 data-[pressed=true]:!bg-p-100 md:block md:h-12 md:w-12`}
      >
        <SettingsSvg className="group-aria-expanded:text-n-5" />
      </Button>
      <Menu onAction={onMenuAction} className="min-w-[12.5rem] rounded-lg !bg-white py-2">
        <MenuItem id="generateInvites">Generate invites for all</MenuItem>
        <MenuItem id="exportAll">Export all</MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

AddResourcesMenu.propTypes = {
  onMenuAction: PropTypes.func,
};
