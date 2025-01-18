import { Menu, MenuItem, MenuTrigger, Button, Separator } from './Menu';
import {
  MoreHorizontal24Regular as MoreHorizontalIcon,
  MoreVertical24Regular as MoreVerticalIcon,
  ChevronDown20Filled as ChevronDown,
  Add24Filled as AddSvg,
} from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';

export default {
  title: 'Components/Menu',
  parameters: {
    backgrounds: {
      default: 'gray',
      values: [
        {
          name: 'gray',
          value: '#dedede',
        },
      ],
    },
  },
};

function ButtonMenu() {
  let isMediumScreen = useScreen('md');

  const items = [
    { id: 'add provider', name: 'Add provider' },
    { id: 'add program', name: 'Add program' },
    { id: 'addSpreadsheet', name: 'Add via spreadsheet' },
  ];

  if (!isMediumScreen) {
    return (
      <MenuTrigger>
        <Button className="h-10 w-10 rounded-lg bg-white text-p-100 ring-p-100 focus-visible:outline-none focus-visible:ring-2 data-[pressed=true]:bg-p-100 data-[pressed=true]:text-inverted md:h-12 md:w-12">
          <AddSvg />
        </Button>
        <Menu onAction={(id) => alert(`selected: ${id}`)} items={items} className="min-w-[200px]">
          {(item) => (
            <MenuItem id={item.id} key={item.id}>
              {item.name}
            </MenuItem>
          )}
        </Menu>
      </MenuTrigger>
    );
  }
  return (
    <MenuTrigger>
      <Button className="group h-12 rounded-lg !bg-white !px-6 text-p-100 shadow-p-100 ring-1 ring-n-50 hover:text-p-120 hover:ring-2 hover:ring-p-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-100 data-[pressed=true]:ring-2 data-[pressed=true]:ring-p-100">
        Add resources <ChevronDown className="!ml-3 group-aria-expanded:rotate-180" />
      </Button>
      <Menu onAction={(id) => alert(`selected: ${id}`)} items={items} className="min-w-[190px]">
        {(item) => (
          <MenuItem id={item.id} key={item.id}>
            {item.name}
          </MenuItem>
        )}
      </Menu>
    </MenuTrigger>
  );
}

function IconMenu() {
  let isMediumScreen = useScreen('md');

  return (
    <MenuTrigger>
      <Button className="h-10 w-10 rounded-lg bg-white text-p-100 ring-p-100 focus-visible:outline-none focus-visible:ring-2 data-[pressed=true]:border data-[pressed=true]:border-solid data-[pressed=true]:border-p-40 data-[pressed=true]:bg-p-20 md:h-12 md:w-12">
        {isMediumScreen ? <MoreHorizontalIcon /> : <MoreVerticalIcon />}
      </Button>
      <Menu className="min-w-[200px]" onAction={(id) => alert(`selected: ${id}`)}>
        <MenuItem id="edit">Edit profile</MenuItem>
        <MenuItem id="generate">Generate invite</MenuItem>
        <MenuItem id="export">Export providers</MenuItem>
        <MenuItem id="delete" className="!text-error-1">
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

function DividerMenu() {
  return (
    <MenuTrigger>
      <Button className="rounded-lg bg-white px-4 text-p-100 ring-p-100 focus-visible:outline-none focus-visible:ring-2 data-[pressed=true]:border data-[pressed=true]:border-solid data-[pressed=true]:border-p-40 data-[pressed=true]:bg-p-20">
        Menu
      </Button>
      <Menu className="min-w-[200px]" onAction={(id) => alert(`selected: ${id}`)}>
        <MenuItem id="edit">Edit profile</MenuItem>
        <MenuItem id="generate">Generate invite</MenuItem>
        <MenuItem id="export">Export providers</MenuItem>
        <Separator className="h-[1px] bg-n-40" />
        <MenuItem id="delete" className="!text-error-1">
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

export function MenuDefault() {
  return (
    <div className="flex space-x-6">
      <ButtonMenu />
      <IconMenu />
      <DividerMenu />
    </div>
  );
}
MenuDefault.storyName = 'Menu';
