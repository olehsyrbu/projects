/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import cn from 'classnames';
import { groupBy } from 'lodash-es';
import {
  ConferenceRoom24Filled as ConferenceRoom,
  Phone24Filled as Phone,
  Laptop24Filled as Laptop,
} from '@fluentui/react-icons';
import { List } from '../../components/List';

export function Amenities({ amenities }) {
  let groups = groupBy(amenities, 'category');

  return amenities?.length > 0 ? (
    <div>
      <h3 className="mb-4 text-xl font-bold">Amenities and rules</h3>

      <div className="flex gap-x-9 gap-y-4 max-md:flex-col">
        <div className="space-y-2 md:order-2">
          <Amenity amenity={groups['Cell phone use'][0]} icon={<Phone />} />
          <Amenity amenity={groups['Laptop / Tablet use'][0]} icon={<Laptop />} />
          <Amenity amenity={groups['Smoking'][0]} icon={<Smoking />} />
          <Amenity amenity={groups['Vaping'][0]} icon={<Vaping />} />
          <Amenity amenity={groups['Exercise'][0]} icon={<Exercise />} />
        </div>

        {groups['Facilities']?.length > 0 ? (
          <div className="break-inside-avoid space-y-2 pl-8 md:w-[280px]">
            <h4 className="-ml-8 flex items-center text-base font-bold">
              <ConferenceRoom className="mr-2" />
              Facilities
            </h4>
            <List items={groups['Facilities']} />
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

function Amenity({ amenity, icon }) {
  let permitted = ['ACPUP', 'ALTUP', 'ASP', 'AVP', 'AEP'];
  let prohibited = ['ACPUSP', 'ALTUSP', 'ASNP', 'AVNP', 'AENP'];

  return (
    <div className="flex flex-wrap items-center gap-x-2 text-base">
      {icon}
      <span className="font-bold">{amenity.category}</span>
      <span
        className={cn('inline-block rounded-full bg-[#fff2c9] px-2.5', {
          '!bg-[#ebfce7]': permitted.includes(amenity.code),
          '!bg-[#f9e9e6]': prohibited.includes(amenity.code),
        })}
      >
        {amenity.name}
      </span>
    </div>
  );
}

function Smoking() {
  return (
    <svg
      width="24"
      height="24"
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1.5C10.5 6.5 20.6539 5 18.6538 10.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M2 13.5C2 12.9477 2.44772 12.5 3 12.5H9V17.5H3C2.44772 17.5 2 17.0523 2 16.5V13.5Z"
        fill="currentColor"
      />
      <path
        d="M22 13.5C22 12.9477 21.5523 12.5 21 12.5H9V16.5C9 17.0523 10 17.5 10 17.5H21C21.5523 17.5 22 17.0523 22 16.5V13.5Z"
        fill="currentColor"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M9 12.5H10V17.5H9V12.5Z" fill="white" />
    </svg>
  );
}

function Vaping() {
  return (
    <svg
      width="24"
      height="24"
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6C10 5.44772 10.4477 5 11 5H13.5C14.0523 5 14.5 5.44772 14.5 6V9H10V6Z"
        fill="currentColor"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 8.5H10V9H14.5V8.5Z" fill="white" />
      <path
        d="M7 10C7 9.44772 7.44772 9 8 9H15C15.5523 9 16 9.44772 16 10V21.5C16 22.0523 15.5523 22.5 15 22.5H8C7.44772 22.5 7 22.0523 7 21.5V10Z"
        fill="currentColor"
      />
      <path
        d="M8 13C8 12.4477 8.44772 12 9 12C9.55228 12 10 12.4477 10 13V15C10 15.5523 9.55228 16 9 16C8.44772 16 8 15.5523 8 15V13Z"
        fill="white"
      />
      <path d="M12 2H14V6H12V2Z" fill="currentColor" />
    </svg>
  );
}

function Exercise() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden width="24" height="24" fill="none">
      <path
        fill="currentColor"
        d="M11.852 4.84a2.778 2.778 0 0 1 2.442-.775l.372-.369a2 2 0 0 1 2.828.013l.497.502.67-.668a1.86 1.86 0 1 1 2.627 2.635l-.678.676.236.238a2 2 0 0 1-.012 2.829l-.222.219a2.78 2.78 0 0 1-4.634 2.75l-.922-.92-3.022 2.997.986 1.006a2.781 2.781 0 0 1-2.485 4.683l-.378.367a2 2 0 0 1-2.828-.043l-.484-.498-.685.668a1.86 1.86 0 1 1-2.6-2.663l.694-.676-.242-.249a2 2 0 0 1 .043-2.828l.223-.217a2.78 2.78 0 0 1 4.663-2.704l1.149 1.172 3-2.978-1.235-1.234a2.781 2.781 0 0 1-.003-3.933Zm7.786 1.033.701-.7a.456.456 0 1 0-.645-.646l-.698.698.642.648Zm-1.65 2.717a.604.604 0 0 1-.855.853L15.471 7.78a.604.604 0 0 1 .854-.853l1.662 1.663ZM5.215 18.803l-.716.7a.456.456 0 1 0 .637.652l.714-.698-.635-.654ZM6.9 16.107a.624.624 0 1 1 .891-.872l1.617 1.652a.624.624 0 0 1-.892.872l-1.616-1.652Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

Amenities.propTypes = {
  amenities: PropTypes.array,
};
Amenity.propTypes = {
  amenity: PropTypes.object.isRequired,
  icon: PropTypes.element.isRequired,
};
